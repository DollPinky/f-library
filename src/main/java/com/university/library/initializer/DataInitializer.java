package com.university.library.initializer;

import com.university.library.entity.*;
import com.university.library.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final CampusRepository campusRepository;
    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final BookCopyRepository bookCopyRepository;
    private final PasswordEncoder passwordEncoder;

    // Maps to store references to entities by their natural keys
    private Map<String, Campus> campusMap = new HashMap<>();
    private Map<String, Category> categoryMap = new HashMap<>();
    private Map<String, Book> bookMap = new HashMap<>();

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return;
        }

        // 1. Create Permissions
        createPermissions();

        // 2. Create Roles
        createRoles();

        // 3. Create Campuses
        createCampuses();

        // 5. Create Categories
        createCategories();

        // 6. Create Books
        createBooks();

        // 7. Create Users
        createUsers();

    }

    private void createPermissions() {
        Permission[] permissions = {
                new Permission("User Management", "USER_MANAGE", "Quản lý người dùng"),
                new Permission("User View", "USER_VIEW", "Xem thông tin người dùng"),
                new Permission("Book Management", "BOOK_MANAGE", "Quản lý sách"),
                new Permission("Book View", "BOOK_VIEW", "Xem thông tin sách"),
                new Permission("Borrow Management", "BORROW_MANAGE", "Quản lý mượn trả"),
                new Permission("Report View", "REPORT_VIEW", "Xem báo cáo"),
                new Permission("System Config", "SYSTEM_CONFIG", "Cấu hình hệ thống")
        };

        for (Permission permission : permissions) {
            if (!permissionRepository.existsByCode(permission.getCode())) {
                permissionRepository.save(permission);
            }
        }
    }

    private void createRoles() {
        // ADMIN Role
        if (!roleRepository.existsById("ADMIN")) {
            Role adminRole = Role.builder()
                    .name("ADMIN")
                    .description("Quản trị viên hệ thống")
                    .permissions(Set.copyOf(permissionRepository.findAll()))
                    .build();
            roleRepository.save(adminRole);
        }

        // READER Role
        if (!roleRepository.existsById("READER")) {
            Role readerRole = Role.builder()
                    .name("READER")
                    .description("Người đọc")
                    .permissions(Set.of(
                            permissionRepository.findByCode("BOOK_VIEW")
                    ))
                    .build();
            roleRepository.save(readerRole);
        }
    }

    private void createCampuses() {
        Campus[] campuses = {
                Campus.builder()
                        .name("Chi nhánh TP.HCM")
                        .code("HCM-F-Town-1")
                        .address("456 Đường Nguyễn Huệ, Quận 1, TP.HCM")
                        .build(),
                Campus.builder()
                        .name("Chi nhánh TP.HCM")
                        .code("HCM-F-Town-2")
                        .address("456 Đường Nguyễn Huệ, Quận 1, TP.HCM")
                        .build(),
                Campus.builder()
                        .name("Chi nhánh Hà Nội")
                        .code("HN-F-Town-3")
                        .address("123 Đường Lê Lợi, Quận Hoàn Kiếm, Hà Nội")
                        .build(),
                Campus.builder()
                        .name("Chi nhánh Hà Nội")
                        .code("HN-F-Town-4")
                        .address("124 Đường Lê Lợi, Quận Hoàn Kiếm, Hà Nội")
                        .build(),

        };

        for (Campus campus : campuses) {
            if (!campusRepository.existsByCode(campus.getCode())) {
                Campus savedCampus = campusRepository.save(campus);
                campusMap.put(savedCampus.getCode(), savedCampus);
            } else {
                campusMap.put(campus.getCode(), campusRepository.findByCode(campus.getCode()));
            }
        }
    }


    private void createCategories() {
        Category[] categories = {
                Category.builder()
                        .name("Văn học")
                        .description("Sách văn học Việt Nam và thế giới")
                        .build(),
                Category.builder()
                        .name("Khoa học")
                        .description("Sách khoa học tự nhiên và xã hội")
                        .build(),
                Category.builder()
                        .name("Công nghệ")
                        .description("Sách về công nghệ thông tin và kỹ thuật")
                        .build(),
                Category.builder()
                        .name("Kinh tế")
                        .description("Sách về kinh tế, tài chính và quản lý")
                        .build(),
                Category.builder()
                        .name("Lịch sử")
                        .description("Sách lịch sử Việt Nam và thế giới")
                        .build()
        };

        for (Category category : categories) {
            Category savedCategory = categoryRepository.save(category);
            categoryMap.put(savedCategory.getName(), savedCategory);
        }
    }

    private void createBooks() {
        Book[] books = {
                Book.builder()
                        .category(categoryMap.get("Văn học"))
                        .title("Truyện Kiều")
                        .author("Nguyễn Du")
                        .publisher("NXB Văn học")
                        .year(1820)
                        .description("Tác phẩm văn học kinh điển của Việt Nam")
                        .build(),
                Book.builder()
                        .category(categoryMap.get("Khoa học"))
                        .title("Vũ trụ trong lòng bàn tay")
                        .author("Neil deGrasse Tyson")
                        .publisher("NXB Khoa học")
                        .year(2017)
                        .description("Khám phá vũ trụ qua góc nhìn khoa học")
                        .build(),
                Book.builder()
                        .category(categoryMap.get("Công nghệ"))
                        .title("Clean Code")
                        .author("Robert C. Martin")
                        .publisher("Prentice Hall")
                        .year(2008)
                        .description("Hướng dẫn viết code sạch và dễ bảo trì")
                        .build(),
                Book.builder()
                        .category(categoryMap.get("Kinh tế"))
                        .title("Nghĩ giàu làm giàu")
                        .author("Napoleon Hill")
                        .publisher("NXB Tổng hợp")
                        .year(1937)
                        .description("Sách về tư duy làm giàu")
                        .build(),
                Book.builder()
                        .category(categoryMap.get("Lịch sử"))
                        .title("Lịch sử Việt Nam")
                        .author("Trần Trọng Kim")
                        .publisher("NXB Văn hóa")
                        .year(1920)
                        .description("Lịch sử Việt Nam từ thời cổ đại")
                        .build()
        };

        for (Book book : books) {
            Book savedBook = bookRepository.save(book);
            bookMap.put(savedBook.getTitle(), savedBook);
        }
    }

    private void createUsers() {
        Instant now = Instant.now();
        Role adminRole = roleRepository.findById("ADMIN").orElseThrow();
        Role readerRole = roleRepository.findById("READER").orElseThrow();

        User[] users = {
                // Admin account
                User.builder()
                        .fullName("Nguyễn Văn Admin")
                        .email("admin@company.com")
                        .passwordHash(passwordEncoder.encode("admin123"))
                        .phone("0123456789")
                        .role(User.AccountRole.ADMIN)
                        .department("IT")
                        .position("System Administrator")
                        .companyAccount("EMP001")
                        .isActive(true)
                        .campus(campusMap.get("HCM-F-Town-1"))
                        .roles(Set.of(adminRole))
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                // Reader accounts (employees)
                User.builder()
                        .fullName("Hoàng Văn Nhân viên HN")
                        .email("employee.hn1@company.com")
                        .passwordHash(passwordEncoder.encode("employee123"))
                        .phone("0123456793")
                        .role(User.AccountRole.READER)
                        .department("Marketing")
                        .position("Nhân viên Marketing")
                        .companyAccount("EMP005")
                        .isActive(true)
                        .campus(campusMap.get("HCM-F-Town-1"))
                        .roles(Set.of(readerRole))
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                User.builder()
                        .fullName("Vũ Thị Nhân viên HN")
                        .email("employee.hn2@company.com")
                        .passwordHash(passwordEncoder.encode("employee123"))
                        .phone("0123456794")
                        .role(User.AccountRole.READER)
                        .department("Sales")
                        .position("Nhân viên Sales")
                        .companyAccount("EMP006")
                        .isActive(true)
                        .campus(campusMap.get("HCM-F-Town-1"))
                        .roles(Set.of(readerRole))
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                User.builder()
                        .fullName("Đỗ Văn Nhân viên HCM")
                        .email("employee.hcm1@company.com")
                        .passwordHash(passwordEncoder.encode("employee123"))
                        .phone("0123456795")
                        .role(User.AccountRole.READER)
                        .department("IT")
                        .position("Lập trình viên")
                        .companyAccount("EMP007")
                        .isActive(true)
                        .campus(campusMap.get("HCM-F-Town-1"))
                        .roles(Set.of(readerRole))
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                User.builder()
                        .fullName("Ngô Thị Nhân viên HCM")
                        .email("employee.hcm2@company.com")
                        .passwordHash(passwordEncoder.encode("employee123"))
                        .phone("0123456796")
                        .role(User.AccountRole.READER)
                        .department("HR")
                        .position("Nhân viên HR")
                        .companyAccount("EMP008")
                        .isActive(true)
                        .campus(campusMap.get("HCM-F-Town-1"))
                        .roles(Set.of(readerRole))
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                User.builder()
                        .fullName("Bùi Văn Nhân viên DN")
                        .email("employee.dn1@company.com")
                        .passwordHash(passwordEncoder.encode("employee123"))
                        .phone("0123456797")
                        .role(User.AccountRole.READER)
                        .department("Finance")
                        .position("Kế toán")
                        .companyAccount("EMP009")
                        .isActive(true)
                        .campus(campusMap.get("HCM-F-Town-1"))
                        .roles(Set.of(readerRole))
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                User.builder()
                        .fullName("Lê Văn Nhân viên DN")
                        .email("employee.dn2@company.com")
                        .passwordHash(passwordEncoder.encode("employee123"))
                        .phone("0123456798")
                        .role(User.AccountRole.READER)
                        .department("Finance")
                        .position("Kế toán")
                        .companyAccount("EMP010")
                        .isActive(true)
                        .campus(campusMap.get("HCM-F-Town-1"))
                        .roles(Set.of(readerRole))
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build()
        };

        for (User user : users) {
            userRepository.save(user);
        }
    }

}