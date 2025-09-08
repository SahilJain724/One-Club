package com.oneClub.orders_service.services;

import com.oneClub.orders_service.dtos.*;
import com.oneClub.orders_service.feignClients.CartServiceClient;
import com.oneClub.orders_service.feignClients.PaymentServiceClient;
import com.oneClub.orders_service.feignClients.ProductInventoryClient;
import com.oneClub.orders_service.feignClients.UserServiceClient;
import com.oneClub.orders_service.mappers.OrderMapper;
import com.oneClub.orders_service.models.*;
import com.oneClub.orders_service.repositories.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepo;
    private final CartServiceClient cartServiceClient;
    private final ProductInventoryClient productInventoryClient;
    private final UserServiceClient userServiceClient;
    private final PaymentServiceClient paymentServiceClient;

    @Transactional
    public PaymentResponseDTO placeOrder(Integer userId, OrderRequestDTO dto, String roles) {
        List<CartItemDTO> cartItems = cartServiceClient.getCartItems(userId, roles);
        if (cartItems.isEmpty()) throw new RuntimeException("Cart is empty");

        AddressResponseDTO address = (dto.getId() != null)
                ? userServiceClient.getAddressById(dto.getId())
                : userServiceClient.addAddress(userId, dto);
        if (address == null) throw new RuntimeException("Couldn't fetch or create shipping address");

        Order order = Order.builder()
                .userId(userId)
                .shippingAddressId(address.getId())
                .orderDate(LocalDateTime.now())
                .paymentStatus(PaymentStatus.FAILED)
                .deliveryStatus(DeliveryStatus.PENDING)
                .receiverName(dto.getReceiverName())
                .receiverPhone(dto.getReceiverPhone())
                .build();

        List<OrderItem> orderItems = cartItems.stream().map(item -> {
            int available = productInventoryClient.checkQuantityById(item.getProdId());
            if (available < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product ID: " + item.getProdId());
            }
            productInventoryClient.reserveStock(item.getProdId(), item.getQuantity());
            ProductResponseDTO product = productInventoryClient.getProductById(item.getProdId());

            return OrderItem.builder()
                    .order(order)
                    .prodId(item.getProdId())
                    .productTitle(product.getTitle())
                    .quantity(item.getQuantity())
                    .price(BigDecimal.valueOf(item.getPrice()))
                    .build();
        }).toList();

        order.setItems(orderItems);

        BigDecimal itemTotal = orderItems.stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        boolean isFreeDelivery = itemTotal.compareTo(BigDecimal.valueOf(200)) > 0;
        order.setFreeDelivery(isFreeDelivery ? 1 : 0);

        BigDecimal finalAmount = isFreeDelivery ? itemTotal : itemTotal.add(BigDecimal.valueOf(25));
        order.setTotalAmount(finalAmount);

        orderRepo.save(order);

        PaymentRequestDTO paymentRequest = new PaymentRequestDTO(order.getId(), finalAmount);
        return paymentServiceClient.createPayment(paymentRequest);
    }

    @Transactional
    public void handlePaymentSuccess(Integer orderId, String paymentId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        order.setPaymentStatus(PaymentStatus.PAID);
        order.setPaymentId(paymentId);
        orderRepo.save(order);
    }

    @Transactional
    public void handlePaymentFailed(Integer orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        order.getItems().forEach(item ->
                productInventoryClient.releaseReservedStock(item.getProdId(), item.getQuantity()));

        orderRepo.delete(order);
    }

    public List<OrderResponseDTO> getOrderHistory(Integer userId) {
        UserDTO user = userServiceClient.getUserById(userId);
        List<Order> orders = orderRepo.findByUserIdOrderByOrderDateDesc(userId);

        return orders.stream()
                .map(order -> {
                    AddressResponseDTO address = userServiceClient.getAddressById(order.getShippingAddressId());
                    return OrderMapper.mapToDTO(order, address, user);
                })
                .collect(Collectors.toList());
    }

    public OrderResponseDTO updateOrderAddress(Integer orderId, OrderRequestDTO newAddress, Integer userId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to update this order");
        }

        userServiceClient.updateAddress(newAddress);
        order.setShippingAddressId(newAddress.getId());
        orderRepo.save(order);

        UserDTO user = userServiceClient.getUserById(userId);
        AddressResponseDTO address = userServiceClient.getAddressById(newAddress.getId());
        return OrderMapper.mapToDTO(order, address, user);
    }

    public void updateDeliveryStatus(Integer orderId, String newStatus) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        DeliveryStatus deliveryStatus = DeliveryStatus.valueOf(newStatus.toUpperCase());
        order.setDeliveryStatus(deliveryStatus);
        orderRepo.save(order);
    }

    public List<OrderResponseDTO> getAllOrdersForAdmin() {
        List<Order> allOrders = orderRepo.findAll();
        return allOrders.stream()
                .map(order -> {
                    UserDTO user = userServiceClient.getUserById(order.getUserId());
                    AddressResponseDTO address = userServiceClient.getAddressById(order.getShippingAddressId());
                    return OrderMapper.mapToDTO(order, address, user);
                }).collect(Collectors.toList());
    }
}
