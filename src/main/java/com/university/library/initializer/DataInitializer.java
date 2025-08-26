package com.university.library.initializer;

import com.university.library.entity.*;
import com.university.library.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final CampusRepository campusRepository;
    private final LibraryRepository libraryRepository;
    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    private final BookCopyRepository bookCopyRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final PasswordEncoder passwordEncoder;

    // Maps to store references to entities by their natural keys
    private Map<String, Campus> campusMap = new HashMap<>();
    private Map<String, Library> libraryMap = new HashMap<>();
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

        // 4. Create Libraries
        createLibraries();

        // 5. Create Categories
        createCategories();

        // 6. Create Books
        createBooks();

        // 7. Create Users
        createUsers();

        // 8. Create Book Copies
        createBookCopies();
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

        // LIBRARIAN Role
        if (!roleRepository.existsById("LIBRARIAN")) {
            Role librarianRole = Role.builder()
                    .name("LIBRARIAN")
                    .description("Thủ thư")
                    .permissions(Set.of(
                            permissionRepository.findByCode("BOOK_MANAGE"),
                            permissionRepository.findByCode("BOOK_VIEW"),
                            permissionRepository.findByCode("BORROW_MANAGE"),
                            permissionRepository.findByCode("USER_VIEW"),
                            permissionRepository.findByCode("REPORT_VIEW")
                    ))
                    .build();
            roleRepository.save(librarianRole);
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
                        .name("Chi nhánh Hà Nội")
                        .code("HN")
                        .address("123 Đường Lê Lợi, Quận Hoàn Kiếm, Hà Nội")
                        .build(),
                Campus.builder()
                        .name("Chi nhánh TP.HCM")
                        .code("HCM")
                        .address("456 Đường Nguyễn Huệ, Quận 1, TP.HCM")
                        .build(),
                Campus.builder()
                        .name("Chi nhánh Đà Nẵng")
                        .code("DN")
                        .address("789 Đường Trần Phú, Quận Hải Châu, Đà Nẵng")
                        .build()
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

    private void createLibraries() {
        Library[] libraries = {
                Library.builder()
                        .campus(campusMap.get("HN"))
                        .name("Thư viện Hà Nội - Tầng 1")
                        .code("HN_LIB_1")
                        .address("Tầng 1, Tòa A, Chi nhánh Hà Nội")
                        .build(),
                Library.builder()
                        .campus(campusMap.get("HN"))
                        .name("Thư viện Hà Nội - Tầng 2")
                        .code("HN_LIB_2")
                        .address("Tầng 2, Tòa A, Chi nhánh Hà Nội")
                        .build(),
                Library.builder()
                        .campus(campusMap.get("HCM"))
                        .name("Thư viện TP.HCM - Tầng 1")
                        .code("HCM_LIB_1")
                        .address("Tầng 1, Tòa B, Chi nhánh TP.HCM")
                        .build(),
                Library.builder()
                        .campus(campusMap.get("HCM"))
                        .name("Thư viện TP.HCM - Tầng 2")
                        .code("HCM_LIB_2")
                        .address("Tầng 2, Tòa B, Chi nhánh TP.HCM")
                        .build(),
                Library.builder()
                        .campus(campusMap.get("DN"))
                        .name("Thư viện Đà Nẵng")
                        .code("DN_LIB_1")
                        .address("Tầng 1, Tòa C, Chi nhánh Đà Nẵng")
                        .build()
        };

        for (Library library : libraries) {
            if (!libraryRepository.existsByCode(library.getCode())) {
                Library savedLibrary = libraryRepository.save(library);
                libraryMap.put(savedLibrary.getCode(), savedLibrary);
            } else {
                libraryMap.put(library.getCode(), libraryRepository.findByCode(library.getCode()));
            }
        }
    }

    private void createCategories() {
        Category[] categories = {
                Category.builder()
                        .name("Văn học")
                        .description("Sách văn học Việt Nam và thế giới")
                        .color("#5a735a")
                        .build(),
                Category.builder()
                        .name("Khoa học")
                        .description("Sách khoa học tự nhiên và xã hội")
                        .color("#7a907a")
                        .build(),
                Category.builder()
                        .name("Công nghệ")
                        .description("Sách về công nghệ thông tin và kỹ thuật")
                        .color("#a3b3a3")
                        .build(),
                Category.builder()
                        .name("Kinh tế")
                        .description("Sách về kinh tế, tài chính và quản lý")
                        .color("#c7d0c7")
                        .build(),
                Category.builder()
                        .name("Lịch sử")
                        .description("Sách lịch sử Việt Nam và thế giới")
                        .color("#e3e7e3")
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
                        .isbn("978-604-0-00001-1")
                        .description("Tác phẩm văn học kinh điển của Việt Nam")
                        .build(),
                Book.builder()
                        .category(categoryMap.get("Khoa học"))
                        .title("Vũ trụ trong lòng bàn tay")
                        .author("Neil deGrasse Tyson")
                        .publisher("NXB Khoa học")
                        .year(2017)
                        .isbn("978-604-0-00002-2")
                        .description("Khám phá vũ trụ qua góc nhìn khoa học")
                        .build(),
                Book.builder()
                        .category(categoryMap.get("Công nghệ"))
                        .title("Clean Code")
                        .author("Robert C. Martin")
                        .publisher("Prentice Hall")
                        .year(2008)
                        .isbn("978-604-0-00003-3")
                        .description("Hướng dẫn viết code sạch và dễ bảo trì")
                        .build(),
                Book.builder()
                        .category(categoryMap.get("Kinh tế"))
                        .title("Nghĩ giàu làm giàu")
                        .author("Napoleon Hill")
                        .publisher("NXB Tổng hợp")
                        .year(1937)
                        .isbn("978-604-0-00004-4")
                        .description("Sách về tư duy làm giàu")
                        .build(),
                Book.builder()
                        .category(categoryMap.get("Lịch sử"))
                        .title("Lịch sử Việt Nam")
                        .author("Trần Trọng Kim")
                        .publisher("NXB Văn hóa")
                        .year(1920)
                        .isbn("978-604-0-00005-5")
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
        Role librarianRole = roleRepository.findById("LIBRARIAN").orElseThrow();
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
                        .employeeCode("EMP001")
                        .isActive(true)
                        .campus(campusMap.get("HN"))
                        .roles(Set.of(adminRole))
                        .createdAt(now)
                        .updatedAt(now)
                        .build(),

                // Librarian accounts
                User.builder()
                        .fullName("Trần Thị Thủ thư HN")
                        .email("librarian.hn@company.com")
                        .passwordHash(passwordEncoder.encode("librarian123"))
                        .phone("0123456790")
                        .role(User.AccountRole.LIBRARIAN)
                        .department("Thư viện")
                        .position("Thủ thư")
                        .employeeCode("EMP002")
                        .isActive(true)
                        .campus(campusMap.get("HN"))
                        .roles(Set.of(librarianRole))
                        .createdAt(now)
                        .updatedAt(now)
                        .build(),
                User.builder()
                        .fullName("Lê Văn Thủ thư HCM")
                        .email("librarian.hcm@company.com")
                        .passwordHash(passwordEncoder.encode("librarian123"))
                        .phone("0123456791")
                        .role(User.AccountRole.LIBRARIAN)
                        .department("Thư viện")
                        .position("Thủ thư")
                        .employeeCode("EMP003")
                        .isActive(true)
                        .campus(campusMap.get("HCM"))
                        .roles(Set.of(librarianRole))
                        .createdAt(now)
                        .updatedAt(now)
                        .build(),
                User.builder()
                        .fullName("Phạm Thị Thủ thư DN")
                        .email("librarian.dn@company.com")
                        .passwordHash(passwordEncoder.encode("librarian123"))
                        .phone("0123456792")
                        .role(User.AccountRole.LIBRARIAN)
                        .department("Thư viện")
                        .position("Thủ thư")
                        .employeeCode("EMP004")
                        .isActive(true)
                        .campus(campusMap.get("DN"))
                        .roles(Set.of(librarianRole))
                        .createdAt(now)
                        .updatedAt(now)
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
                        .employeeCode("EMP005")
                        .isActive(true)
                        .campus(campusMap.get("HN"))
                        .roles(Set.of(readerRole))
                        .createdAt(now)
                        .updatedAt(now)
                        .build(),
                User.builder()
                        .fullName("Vũ Thị Nhân viên HN")
                        .email("employee.hn2@company.com")
                        .passwordHash(passwordEncoder.encode("employee123"))
                        .phone("0123456794")
                        .role(User.AccountRole.READER)
                        .department("Sales")
                        .position("Nhân viên Sales")
                        .employeeCode("EMP006")
                        .isActive(true)
                        .campus(campusMap.get("HN"))
                        .roles(Set.of(readerRole))
                        .createdAt(now)
                        .updatedAt(now)
                        .build(),
                User.builder()
                        .fullName("Đỗ Văn Nhân viên HCM")
                        .email("employee.hcm1@company.com")
                        .passwordHash(passwordEncoder.encode("employee123"))
                        .phone("0123456795")
                        .role(User.AccountRole.READER)
                        .department("IT")
                        .position("Lập trình viên")
                        .employeeCode("EMP007")
                        .isActive(true)
                        .campus(campusMap.get("HCM"))
                        .roles(Set.of(readerRole))
                        .createdAt(now)
                        .updatedAt(now)
                        .build(),
                User.builder()
                        .fullName("Ngô Thị Nhân viên HCM")
                        .email("employee.hcm2@company.com")
                        .passwordHash(passwordEncoder.encode("employee123"))
                        .phone("0123456796")
                        .role(User.AccountRole.READER)
                        .department("HR")
                        .position("Nhân viên HR")
                        .employeeCode("EMP008")
                        .isActive(true)
                        .campus(campusMap.get("HCM"))
                        .roles(Set.of(readerRole))
                        .createdAt(now)
                        .updatedAt(now)
                        .build(),
                User.builder()
                        .fullName("Bùi Văn Nhân viên DN")
                        .email("employee.dn1@company.com")
                        .passwordHash(passwordEncoder.encode("employee123"))
                        .phone("0123456797")
                        .role(User.AccountRole.READER)
                        .department("Finance")
                        .position("Kế toán")
                        .employeeCode("EMP009")
                        .isActive(true)
                        .campus(campusMap.get("DN"))
                        .roles(Set.of(readerRole))
                        .createdAt(now)
                        .updatedAt(now)
                        .build(),
                User.builder()
                        .fullName("Lê Văn Nhân viên DN")
                        .email("employee.dn2@company.com")
                        .passwordHash(passwordEncoder.encode("employee123"))
                        .phone("0123456798")
                        .role(User.AccountRole.READER)
                        .department("Finance")
                        .position("Kế toán")
                        .employeeCode("EMP010")
                        .isActive(true)
                        .campus(campusMap.get("DN"))
                        .roles(Set.of(readerRole))
                        .createdAt(now)
                        .updatedAt(now)
                        .build()
        };

        for (User user : users) {
            userRepository.save(user);
        }
    }

    private void createBookCopies() {
        Instant now = Instant.now();

        // Helper class to store book copy information
        class BookCopyInfo {
            String bookTitle;
            String libraryCode;
            String qrCode;
            String shelfLocation;

            BookCopyInfo(String bookTitle, String libraryCode, String qrCode, String shelfLocation) {
                this.bookTitle = bookTitle;
                this.libraryCode = libraryCode;
                this.qrCode = qrCode;
                this.shelfLocation = shelfLocation;
            }
        }

        List<BookCopyInfo> bookCopyInfos = Arrays.asList(
                // HN Library copies
                new BookCopyInfo("Truyện Kiều", "HN_LIB_1", "BK_9786040000011_HN_LIB_1_001", "A1-R1-S1"),
                new BookCopyInfo("Vũ trụ trong lòng bàn tay", "HN_LIB_1", "BK_9786040000022_HN_LIB_1_001", "A2-R1-S1"),
                new BookCopyInfo("Clean Code", "HN_LIB_1", "BK_9786040000033_HN_LIB_1_001", "A3-R1-S1"),

                // HCM Library copies
                new BookCopyInfo("Truyện Kiều", "HCM_LIB_1", "BK_9786040000011_HCM_LIB_1_001", "B1-R1-S1"),
                new BookCopyInfo("Nghĩ giàu làm giàu", "HCM_LIB_1", "BK_9786040000044_HCM_LIB_1_001", "B2-R1-S1"),
                new BookCopyInfo("Lịch sử Việt Nam", "HCM_LIB_1", "BK_9786040000055_HCM_LIB_1_001", "B3-R1-S1"),

                // DN Library copies
                new BookCopyInfo("Vũ trụ trong lòng bàn tay", "DN_LIB_1", "BK_9786040000022_DN_LIB_1_001", "C1-R1-S1"),
                new BookCopyInfo("Clean Code", "DN_LIB_1", "BK_9786040000033_DN_LIB_1_001", "C2-R1-S1")
        );

        for (BookCopyInfo info : bookCopyInfos) {
            Book book = bookMap.get(info.bookTitle);
            Library library = libraryMap.get(info.libraryCode);

            if (book != null && library != null) {
                BookCopy bookCopy = BookCopy.builder()
                        .book(book)
                        .library(library)
                        .qrCode(info.qrCode)
                        .status(BookCopy.BookStatus.AVAILABLE)
                        .shelfLocation(info.shelfLocation)
                        .createdAt(now)
                        .updatedAt(now)
                        .build();
                bookCopyRepository.save(bookCopy);
            }
        }
    }
}