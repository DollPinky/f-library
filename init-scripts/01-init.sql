-- =====================================================
-- LIBRARY MANAGEMENT SYSTEM - INITIALIZATION SCRIPT
-- =====================================================

DROP TABLE IF EXISTS borrowings CASCADE;
DROP TABLE IF EXISTS book_copies CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS libraries CASCADE;
DROP TABLE IF EXISTS campuses CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;



--chat_history
CREATE TABLE chat_history (
                              chat_history_id UUID PRIMARY KEY,
                              prompt TEXT,
                              response TEXT,
                              embedding vector(1024),
                              created_at TIMESTAMP
);

-- =====================================================
-- CREATE TABLES
-- =====================================================

-- Campuses table
CREATE TABLE campuses (
    campus_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Libraries table
CREATE TABLE libraries (
    library_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campus_id UUID NOT NULL REFERENCES campuses(campus_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) NOT NULL DEFAULT '#5a735a',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE books (
    book_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(category_id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    publisher VARCHAR(255),
    year INTEGER,
    isbn VARCHAR(20) UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Book copies table
CREATE TABLE book_copies (
    book_copy_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
    library_id UUID NOT NULL REFERENCES libraries(library_id) ON DELETE CASCADE,
    qr_code VARCHAR(255) UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE', -- AVAILABLE, BORROWED, RESERVED, LOST, DAMAGED
    shelf_location VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Accounts table (for authentication and user management)
CREATE TABLE accounts (
    account_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    department VARCHAR(255),
    position VARCHAR(255),
    employee_code VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- ADMIN, LIBRARIAN, READER
    campus_id UUID NOT NULL REFERENCES campuses(campus_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Staff table (for library staff management)
CREATE TABLE staff (
    staff_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    library_id UUID NOT NULL REFERENCES libraries(library_id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
    hire_date DATE NOT NULL,
    salary DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Borrowings table
CREATE TABLE borrowings (
    borrowing_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_copy_id UUID NOT NULL REFERENCES book_copies(book_copy_id) ON DELETE CASCADE,
    borrower_id UUID NOT NULL REFERENCES accounts(account_id) ON DELETE CASCADE,
    borrowed_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    returned_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL DEFAULT 'BORROWED', -- RESERVED, BORROWED, RETURNED, OVERDUE, LOST, CANCELLED
    fine_amount DECIMAL(10,2) DEFAULT 0.0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CREATE INDEXES
-- =====================================================

-- Campus indexes
CREATE INDEX idx_campuses_code ON campuses(code);
CREATE INDEX idx_campuses_name ON campuses(name);

-- Library indexes
CREATE INDEX idx_libraries_campus_id ON libraries(campus_id);
CREATE INDEX idx_libraries_code ON libraries(code);
CREATE INDEX idx_libraries_name ON libraries(name);

-- Category indexes
CREATE INDEX idx_categories_name ON categories(name);

-- Book indexes
CREATE INDEX idx_books_category_id ON books(category_id);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_isbn ON books(isbn);

-- Book copy indexes
CREATE INDEX idx_book_copies_book_id ON book_copies(book_id);
CREATE INDEX idx_book_copies_library_id ON book_copies(library_id);
CREATE INDEX idx_book_copies_qr_code ON book_copies(qr_code);
CREATE INDEX idx_book_copies_status ON book_copies(status);

-- Account indexes
CREATE INDEX idx_accounts_email ON accounts(email);
CREATE INDEX idx_accounts_employee_code ON accounts(employee_code);
CREATE INDEX idx_accounts_campus_id ON accounts(campus_id);
CREATE INDEX idx_accounts_role ON accounts(role);

-- Staff indexes
CREATE INDEX idx_staff_library_id ON staff(library_id);
CREATE INDEX idx_staff_account_id ON staff(account_id);

-- Borrowing indexes
CREATE INDEX idx_borrowings_book_copy_id ON borrowings(book_copy_id);
CREATE INDEX idx_borrowings_borrower_id ON borrowings(borrower_id);
CREATE INDEX idx_borrowings_status ON borrowings(status);
CREATE INDEX idx_borrowings_due_date ON borrowings(due_date);

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Insert campuses
INSERT INTO campuses (campus_id, name, code, address) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Chi nhánh Hà Nội', 'HN', '123 Đường Lê Lợi, Quận Hoàn Kiếm, Hà Nội'),
('550e8400-e29b-41d4-a716-446655440002', 'Chi nhánh TP.HCM', 'HCM', '456 Đường Nguyễn Huệ, Quận 1, TP.HCM'),
('550e8400-e29b-41d4-a716-446655440003', 'Chi nhánh Đà Nẵng', 'DN', '789 Đường Trần Phú, Quận Hải Châu, Đà Nẵng');

-- Insert libraries
INSERT INTO libraries (library_id, campus_id, name, code, address) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Thư viện Hà Nội - Tầng 1', 'HN_LIB_1', 'Tầng 1, Tòa A, Chi nhánh Hà Nội'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Thư viện Hà Nội - Tầng 2', 'HN_LIB_2', 'Tầng 2, Tòa A, Chi nhánh Hà Nội'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Thư viện TP.HCM - Tầng 1', 'HCM_LIB_1', 'Tầng 1, Tòa B, Chi nhánh TP.HCM'),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Thư viện TP.HCM - Tầng 2', 'HCM_LIB_2', 'Tầng 2, Tòa B, Chi nhánh TP.HCM'),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', 'Thư viện Đà Nẵng', 'DN_LIB_1', 'Tầng 1, Tòa C, Chi nhánh Đà Nẵng');

-- Insert categories
INSERT INTO categories (category_id, name, description, color) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Văn học', 'Sách văn học Việt Nam và thế giới', '#5a735a'),
('770e8400-e29b-41d4-a716-446655440002', 'Khoa học', 'Sách khoa học tự nhiên và xã hội', '#7a907a'),
('770e8400-e29b-41d4-a716-446655440003', 'Công nghệ', 'Sách về công nghệ thông tin và kỹ thuật', '#a3b3a3'),
('770e8400-e29b-41d4-a716-446655440004', 'Kinh tế', 'Sách về kinh tế, tài chính và quản lý', '#c7d0c7'),
('770e8400-e29b-41d4-a716-446655440005', 'Lịch sử', 'Sách lịch sử Việt Nam và thế giới', '#e3e7e3');

-- Insert sample accounts with hashed passwords (password: 12345678)
INSERT INTO accounts (account_id, full_name, email, phone, department, position, employee_code, password_hash, role, campus_id) VALUES
-- Admin accounts
('880e8400-e29b-41d4-a716-446655440001', 'Nguyễn Văn Admin', 'admin@company.com', '0123456789', 'IT', 'System Administrator', 'EMP001', '$2a$10$Ydvo/MrcOPK0SSck2ZtBROdjGYAl2pAyPIhJsWmdliVR1Kv2kDTv.', 'ADMIN', '550e8400-e29b-41d4-a716-446655440001'),

-- Librarian accounts
('880e8400-e29b-41d4-a716-446655440002', 'Trần Thị Thủ thư HN', 'librarian.hn@company.com', '0123456790', 'Thư viện', 'Thủ thư', 'EMP002', '$2a$10$Ydvo/MrcOPK0SSck2ZtBROdjGYAl2pAyPIhJsWmdliVR1Kv2kDTv.', 'LIBRARIAN', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440003', 'Lê Văn Thủ thư HCM', 'librarian.hcm@company.com', '0123456791', 'Thư viện', 'Thủ thư', 'EMP003', '$2a$10$Ydvo/MrcOPK0SSck2ZtBROdjGYAl2pAyPIhJsWmdliVR1Kv2kDTv.', 'LIBRARIAN', '550e8400-e29b-41d4-a716-446655440002'),
('880e8400-e29b-41d4-a716-446655440004', 'Phạm Thị Thủ thư DN', 'librarian.dn@company.com', '0123456792', 'Thư viện', 'Thủ thư', 'EMP004', '$2a$10$Ydvo/MrcOPK0SSck2ZtBROdjGYAl2pAyPIhJsWmdliVR1Kv2kDTv.', 'LIBRARIAN', '550e8400-e29b-41d4-a716-446655440003'),

-- Reader accounts (employees)
('880e8400-e29b-41d4-a716-446655440005', 'Hoàng Văn Nhân viên HN', 'employee.hn1@company.com', '0123456793', 'Marketing', 'Nhân viên Marketing', 'EMP005', '$2a$10$Ydvo/MrcOPK0SSck2ZtBROdjGYAl2pAyPIhJsWmdliVR1Kv2kDTv.', 'READER', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440006', 'Vũ Thị Nhân viên HN', 'employee.hn2@company.com', '0123456794', 'Sales', 'Nhân viên Sales', 'EMP006', '$2a$10$Ydvo/MrcOPK0SSck2ZtBROdjGYAl2pAyPIhJsWmdliVR1Kv2kDTv.', 'READER', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440007', 'Đỗ Văn Nhân viên HCM', 'employee.hcm1@company.com', '0123456795', 'IT', 'Lập trình viên', 'EMP007', '$2a$10$Ydvo/MrcOPK0SSck2ZtBROdjGYAl2pAyPIhJsWmdliVR1Kv2kDTv.', 'READER', '550e8400-e29b-41d4-a716-446655440002'),
('880e8400-e29b-41d4-a716-446655440008', 'Ngô Thị Nhân viên HCM', 'employee.hcm2@company.com', '0123456796', 'HR', 'Nhân viên HR', 'EMP008', '$2a$10$Ydvo/MrcOPK0SSck2ZtBROdjGYAl2pAyPIhJsWmdliVR1Kv2kDTv.', 'READER', '550e8400-e29b-41d4-a716-446655440002'),
('880e8400-e29b-41d4-a716-446655440009', 'Bùi Văn Nhân viên DN', 'employee.dn1@company.com', '0123456797', 'Finance', 'Kế toán', 'EMP009', '$2a$10$Ydvo/MrcOPK0SSck2ZtBROdjGYAl2pAyPIhJsWmdliVR1Kv2kDTv.', 'READER', '550e8400-e29b-41d4-a716-446655440003');

-- Insert staff records (linking accounts to libraries)
INSERT INTO staff (staff_id, library_id, account_id, hire_date, salary) VALUES
('990e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', '2023-01-15', 15000000),
('990e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', '2023-02-20', 15000000),
('990e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440004', '2023-03-10', 15000000);

-- Insert sample books
INSERT INTO books (book_id, category_id, title, author, publisher, year, isbn, description) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'Truyện Kiều', 'Nguyễn Du', 'NXB Văn học', 1820, '978-604-0-00001-1', 'Tác phẩm văn học kinh điển của Việt Nam'),
('aa0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 'Vũ trụ trong lòng bàn tay', 'Neil deGrasse Tyson', 'NXB Khoa học', 2017, '978-604-0-00002-2', 'Khám phá vũ trụ qua góc nhìn khoa học'),
('aa0e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', 'Clean Code', 'Robert C. Martin', 'Prentice Hall', 2008, '978-604-0-00003-3', 'Hướng dẫn viết code sạch và dễ bảo trì'),
('aa0e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004', 'Nghĩ giàu làm giàu', 'Napoleon Hill', 'NXB Tổng hợp', 1937, '978-604-0-00004-4', 'Sách về tư duy làm giàu'),
('aa0e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440005', 'Lịch sử Việt Nam', 'Trần Trọng Kim', 'NXB Văn hóa', 1920, '978-604-0-00005-5', 'Lịch sử Việt Nam từ thời cổ đại');
-- --- Sample Accounts (Staff)
-- INSERT INTO accounts (account_id, username, email, password_hash, full_name, phone, user_type, status, campus_id, library_id, is_deleted, created_at, updated_at) VALUES
-- (gen_random_uuid(), 'admin1', 'admin1@library.edu.vn', '$2a$10$Ydvo/MrcOPK0SSck2ZtBROdjGYAl2pAyPIhJsWmdliVR1Kv2kDTv.', 'Admin User 1', '0123456789', 'STAFF', 'ACTIVE', (SELECT campus_id FROM campuses WHERE code = 'HN'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- (gen_random_uuid(), 'librarian1', 'librarian1@library.edu.vn', '$2a$10$Ydvo/MrcOPK0SSck2ZtBROdjGYAl2pAyPIhJsWmdliVR1Kv2kDTv.', 'Librarian User 1', '0123456790', 'STAFF', 'ACTIVE', (SELECT campus_id FROM campuses WHERE code = 'HCM'), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
--
-- --- Sample Staff
-- INSERT INTO staffs (staff_id, account_id, library_id, employee_id, staff_role, department, position, is_active, can_manage_books, can_manage_users, can_manage_staff, can_view_reports, can_process_borrowings, is_deleted, created_at, updated_at) VALUES
-- (gen_random_uuid(), (SELECT account_id FROM accounts WHERE username = 'admin1'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'EMP001', 'ADMIN', 'IT Department', 'System Administrator', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- (gen_random_uuid(), (SELECT account_id FROM accounts WHERE username = 'librarian1'), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), 'EMP002', 'LIBRARIAN', 'Library Department', 'Senior Librarian', TRUE, TRUE, FALSE, FALSE, TRUE, TRUE, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert book copies with new QR code format: BK_ISBN_LIBRARYCODE_COPYNUMBER
INSERT INTO book_copies (book_copy_id, book_id, library_id, qr_code, status, shelf_location) VALUES
-- HN Library copies
('bb0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'BK_9786040000011_HN_LIB_1_001', 'AVAILABLE', 'A1-R1-S1'),
('bb0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'BK_9786040000022_HN_LIB_1_001', 'AVAILABLE', 'A2-R1-S1'),
('bb0e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'BK_9786040000033_HN_LIB_1_001', 'AVAILABLE', 'A3-R1-S1'),

-- HCM Library copies
('bb0e8400-e29b-41d4-a716-446655440004', 'aa0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 'BK_9786040000011_HCM_LIB_1_001', 'AVAILABLE', 'B1-R1-S1'),
('bb0e8400-e29b-41d4-a716-446655440005', 'aa0e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003', 'BK_9786040000044_HCM_LIB_1_001', 'AVAILABLE', 'B2-R1-S1'),
('bb0e8400-e29b-41d4-a716-446655440006', 'aa0e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440003', 'BK_9786040000055_HCM_LIB_1_001', 'AVAILABLE', 'B3-R1-S1'),

-- DN Library copies
('bb0e8400-e29b-41d4-a716-446655440007', 'aa0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440005', 'BK_9786040000022_DN_LIB_1_001', 'AVAILABLE', 'C1-R1-S1'),
('bb0e8400-e29b-41d4-a716-446655440008', 'aa0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440005', 'BK_9786040000033_DN_LIB_1_001', 'AVAILABLE', 'C2-R1-S1');

-- Insert sample borrowings
INSERT INTO borrowings (borrowing_id, book_copy_id, borrower_id, borrowed_date, due_date, status) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', 'bb0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440005', '2024-01-15 09:00:00+07', '2024-02-15 09:00:00+07', 'BORROWED'),
('cc0e8400-e29b-41d4-a716-446655440002', 'bb0e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440007', '2024-01-10 14:30:00+07', '2024-02-10 14:30:00+07', 'BORROWED'),
('cc0e8400-e29b-41d4-a716-446655440003', 'bb0e8400-e29b-41d4-a716-446655440007', '880e8400-e29b-41d4-a716-446655440009', '2024-01-05 11:00:00+07', '2024-02-05 11:00:00+07', 'BORROWED');

-- =====================================================
-- COMMIT TRANSACTION
-- =====================================================
COMMIT;
