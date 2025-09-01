package com.oneClub.orders_service.utils;

import java.util.Arrays;
import java.util.List;

public class RoleValidator {

    public static boolean isUser(String rolesHeader) {
        return extractRoles(rolesHeader).contains("ROLE_USER");
    }

    public static boolean isAdmin(String rolesHeader) {
        return extractRoles(rolesHeader).contains("ROLE_ADMIN");
    }

    public static boolean isROLE_VENDOR(String rolesHeader) {
        return extractRoles(rolesHeader).contains("ROLE_VENDOR");
    }

    public static boolean isUserOrAdmin(String rolesHeader) {
        List<String> roles = extractRoles(rolesHeader);
        return roles.contains("ROLE_USER") || roles.contains("ROLE_ADMIN");
    }

    private static List<String> extractRoles(String rolesHeader) {
        return Arrays.asList(rolesHeader.split(","));
    }
}
