CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. campuses
CREATE TABLE campuses (
                          campus_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          code VARCHAR(50) UNIQUE NOT NULL,
                          address TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. libraries
CREATE TABLE libraries (
                           library_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                           campus_id UUID NOT NULL REFERENCES campuses(campus_id),
                           name VARCHAR(255) NOT NULL,
                           code VARCHAR(50) UNIQUE NOT NULL,
                           address TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. accounts
CREATE TABLE accounts (
    account_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('STAFF', 'READER')),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING', 'BLOCKED')),
    last_login_at TIMESTAMP,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    campus_id UUID REFERENCES campuses(campus_id),
    library_id UUID REFERENCES libraries(library_id),
    student_id VARCHAR(20),
    faculty VARCHAR(100),
    major VARCHAR(100),
    academic_year INTEGER,
    max_borrow_limit INTEGER DEFAULT 5,
    current_borrow_count INTEGER DEFAULT 0,
    total_borrow_count INTEGER DEFAULT 0,
    overdue_count INTEGER DEFAULT 0,
    fine_amount DECIMAL(10,2) DEFAULT 0.0,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. staffs
CREATE TABLE staffs (
                       staff_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID NOT NULL REFERENCES accounts(account_id) UNIQUE,
                       library_id UUID NOT NULL REFERENCES libraries(library_id),
    employee_id VARCHAR(20) NOT NULL UNIQUE,
    staff_role VARCHAR(50) NOT NULL CHECK (staff_role IN ('ADMIN', 'LIBRARIAN', 'MANAGER', 'ASSISTANT')),
    department VARCHAR(100),
    position VARCHAR(100),
    hire_date TIMESTAMP,
    work_schedule VARCHAR(255),
    specialization VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_activity_at TIMESTAMP,
    can_manage_books BOOLEAN DEFAULT FALSE,
    can_manage_users BOOLEAN DEFAULT FALSE,
    can_manage_staff BOOLEAN DEFAULT FALSE,
    can_view_reports BOOLEAN DEFAULT FALSE,
        can_process_borrowings BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. categories
CREATE TABLE categories (
                            category_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                            name VARCHAR(255) NOT NULL,
                            description TEXT,
    parent_category_id UUID REFERENCES categories(category_id),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. books
CREATE TABLE books (
                       book_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                       title VARCHAR(255) NOT NULL,
                       author VARCHAR(255),
                       publisher VARCHAR(255),
    year INTEGER,
                       isbn VARCHAR(20),
                       description TEXT,
                       category_id UUID REFERENCES categories(category_id),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. book_copies
CREATE TABLE book_copies (
    book_copy_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                             book_id UUID REFERENCES books(book_id),
                             library_id UUID REFERENCES libraries(library_id),
                             qr_code VARCHAR(255) UNIQUE,
                             status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'BORROWED', 'RESERVED', 'LOST', 'DAMAGED')),
                             shelf_location VARCHAR(100),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. readers (legacy table - now replaced by accounts with user_type = 'READER')
CREATE TABLE readers (
                         reader_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                         campus_id UUID REFERENCES campuses(campus_id),
                         name VARCHAR(255) NOT NULL,
                         student_id VARCHAR(50) UNIQUE,
                         email VARCHAR(255) UNIQUE NOT NULL,
                             phone VARCHAR(50),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                         is_active BOOLEAN DEFAULT TRUE
);

-- 9. borrowings
CREATE TABLE borrowings (
                            borrow_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    copy_id UUID REFERENCES book_copies(book_copy_id),
                            reader_id UUID REFERENCES readers(reader_id),
                            borrowed_at TIMESTAMP NOT NULL,
                            due_date DATE NOT NULL,
                            returned_at DATE,
                            status VARCHAR(50) DEFAULT 'BORROWED' CHECK (status IN ('BORROWED', 'RETURNED', 'OVERDUE')),
                            fine_amount NUMERIC(10, 2) DEFAULT 0,
    note TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data

--- Campuses
INSERT INTO campuses (campus_id, name, code, address, is_deleted, created_at, updated_at) VALUES 
(gen_random_uuid(), 'Hà Nội', 'HN', 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'TP. Hồ Chí Minh', 'HCM', '227 Nguyễn Văn Cừ, Q.5, TP.HCM', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Đà Nẵng', 'DN', '41 Lê Duẩn, Hải Châu, Đà Nẵng', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

--- Libraries
INSERT INTO libraries (library_id, campus_id, name, code, address, is_deleted, created_at, updated_at) VALUES 
(gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HN'), 'Thư viện Hà Nội', 'LIB-HN-001', 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HCM'), 'Thư viện TP. Hồ Chí Minh', 'LIB-HCM-001', '227 Nguyễn Văn Cừ, Q.5, TP.HCM', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'DN'), 'Thư viện Đà Nẵng', 'LIB-DN-001', '41 Lê Duẩn, Hải Châu, Đà Nẵng', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

--- Categories
INSERT INTO categories (category_id, name, description, is_deleted, created_at, updated_at) VALUES 
(gen_random_uuid(), 'Khoa học máy tính', 'Mô tả cho Khoa học máy tính', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Toán học', 'Mô tả cho Toán học', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Văn học', 'Mô tả cho Văn học', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Lịch sử', 'Mô tả cho Lịch sử', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Tâm lý học', 'Mô tả cho Tâm lý học', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

--- Books
INSERT INTO books (book_id, title, author, publisher, year, isbn, description, category_id, is_deleted, created_at, updated_at) VALUES 
(gen_random_uuid(), 'Kitchen technology.', 'Amber Kidd', 'Novak and Sons', 2013, '978-1136505587', 'A comprehensive guide to modern kitchen technology and culinary innovations.', (SELECT category_id FROM categories WHERE name = 'Khoa học máy tính'), FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Image loss ten.', 'Carmen Smith', 'Baker-Bowers', 2006, '978-3585650756', 'Exploring the psychological aspects of image and identity loss in modern society.', (SELECT category_id FROM categories WHERE name = 'Tâm lý học'), FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Expect recent room situation.', 'Katelyn Lee', 'Novak PLC', 2006, '978-2801823908', 'Historical analysis of room dynamics and spatial relationships throughout different eras.', (SELECT category_id FROM categories WHERE name = 'Lịch sử'), FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Article finish anyone live try.', 'Amy Romero', 'Jones Inc', 2018, '978-4733616459', 'Advanced mathematical concepts and their applications in real-world scenarios.', (SELECT category_id FROM categories WHERE name = 'Toán học'), FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Identify walk now.', 'Amanda Miller', 'Silva, Mills and Donovan', 2022, '978-7110082321', 'Contemporary literature exploring themes of identity and personal journey.', (SELECT category_id FROM categories WHERE name = 'Văn học'), FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

--- Book Copies
INSERT INTO book_copies (book_copy_id, book_id, library_id, qr_code, status, shelf_location, is_deleted, created_at, updated_at) VALUES 
(gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-1136505587'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-1-9317', 'AVAILABLE', 'S1R5', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-1136505587'), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'QR-1-4258', 'AVAILABLE', 'S2R6', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-3585650756'), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'QR-2-9689', 'AVAILABLE', 'S1R10', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-3585650756'), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), 'QR-2-1319', 'AVAILABLE', 'S1R6', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-2801823908'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-3-1949', 'AVAILABLE', 'S2R10', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

--- Sample Accounts (Staff)
INSERT INTO accounts (account_id, username, email, password_hash, full_name, phone, user_type, status, campus_id, library_id, is_deleted, created_at, updated_at) VALUES 
(gen_random_uuid(), 'admin1', 'admin1@library.edu.vn', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Admin User 1', '0123456789', 'STAFF', 'ACTIVE', (SELECT campus_id FROM campuses WHERE code = 'HN'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'librarian1', 'librarian1@library.edu.vn', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Librarian User 1', '0123456790', 'STAFF', 'ACTIVE', (SELECT campus_id FROM campuses WHERE code = 'HCM'), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

--- Sample Staff
INSERT INTO staffs (staff_id, account_id, library_id, employee_id, staff_role, department, position, is_active, can_manage_books, can_manage_users, can_manage_staff, can_view_reports, can_process_borrowings, is_deleted, created_at, updated_at) VALUES 
(gen_random_uuid(), (SELECT account_id FROM accounts WHERE username = 'admin1'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'EMP001', 'ADMIN', 'IT Department', 'System Administrator', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), (SELECT account_id FROM accounts WHERE username = 'librarian1'), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), 'EMP002', 'LIBRARIAN', 'Library Department', 'Senior Librarian', TRUE, TRUE, FALSE, FALSE, TRUE, TRUE, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

--- Sample Accounts (Readers)
INSERT INTO accounts (account_id, username, email, password_hash, full_name, phone, user_type, status, campus_id, student_id, faculty, major, academic_year, max_borrow_limit, is_deleted, created_at, updated_at) VALUES 
(gen_random_uuid(), 'student1', 'student1@student.edu.vn', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Nguyễn Văn A', '0123456791', 'READER', 'ACTIVE', (SELECT campus_id FROM campuses WHERE code = 'HN'), 'SV010001', 'Công nghệ thông tin', 'Kỹ thuật phần mềm', 2024, 5, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'student2', 'student2@student.edu.vn', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Trần Thị B', '0123456792', 'READER', 'ACTIVE', (SELECT campus_id FROM campuses WHERE code = 'HCM'), 'SV020001', 'Kinh tế', 'Quản trị kinh doanh', 2024, 5, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

--- Legacy Readers (for backward compatibility)
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, is_deleted, created_at, updated_at, registered_at, is_active) VALUES 
(gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'DN'), 'James Lewis', 'SV030001', 'reader1@student.edu.vn', '564-641-7080x53100', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
(gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HCM'), 'Christina Smith', 'SV020002', 'reader2@student.edu.vn', '(327)193-7452', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE);

--- Sample Borrowings
INSERT INTO borrowings (borrow_id, copy_id, reader_id, borrowed_at, due_date, returned_at, status, fine_amount, note, is_deleted, created_at, updated_at) VALUES 
(gen_random_uuid(), (SELECT book_copy_id FROM book_copies WHERE qr_code = 'QR-1-9317'), (SELECT reader_id FROM readers WHERE student_id = 'SV030001'), '2025-07-11 10:00:00', '2025-07-25', '2025-07-22 15:30:00', 'RETURNED', 0, NULL, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), (SELECT book_copy_id FROM book_copies WHERE qr_code = 'QR-2-9689'), (SELECT reader_id FROM readers WHERE student_id = 'SV020002'), '2025-07-15 14:00:00', '2025-07-29', NULL, 'BORROWED', 0, NULL, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
