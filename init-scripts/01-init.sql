CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. campuses
CREATE TABLE campuses (
                          campus_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          code VARCHAR(50) UNIQUE NOT NULL,
                          address TEXT NOT NULL,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. libraries
CREATE TABLE libraries (
                           library_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                           campus_id UUID NOT NULL REFERENCES campuses(campus_id),
                           name VARCHAR(255) NOT NULL,
                           code VARCHAR(50) UNIQUE NOT NULL,
                           address TEXT NOT NULL,
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. staff
CREATE TABLE staff (
                       staff_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                       library_id UUID NOT NULL REFERENCES libraries(library_id),
                       name VARCHAR(255) NOT NULL,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       phone VARCHAR(20),
                       role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'LIBRARIAN', 'MANAGER')),
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       is_active BOOLEAN DEFAULT TRUE
);

-- 4. categories
CREATE TABLE categories (
                            category_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                            name VARCHAR(255) NOT NULL,
                            description TEXT,
                            parent_category_id UUID REFERENCES categories(category_id) -- Child categories inside category (Many to One)
);

-- 5. books
CREATE TABLE books (
                       book_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                       title VARCHAR(255) NOT NULL,
                       author VARCHAR(255),
                       publisher VARCHAR(255),
                       year INT,
                       isbn VARCHAR(20),
                       category_id UUID REFERENCES categories(category_id),
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. book_copies -- Many to One towards book
--	 Many to Many towards library
CREATE TABLE book_copies (
                             copy_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                             book_id UUID REFERENCES books(book_id),
                             library_id UUID REFERENCES libraries(library_id),
                             qr_code VARCHAR(255) UNIQUE,
                             status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'BORROWED', 'RESERVED', 'LOST', 'DAMAGED')),
                             shelf_location VARCHAR(100),
                             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. readers
CREATE TABLE readers (
                         reader_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                         campus_id UUID REFERENCES campuses(campus_id),
                         name VARCHAR(255) NOT NULL,
                         student_id VARCHAR(50) UNIQUE,
                         email VARCHAR(255) UNIQUE NOT NULL,
                         phone VARCHAR(20),
                         registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         is_active BOOLEAN DEFAULT TRUE
);

-- 8. borrowings -- Many to One towards readers
CREATE TABLE borrowings (
                            borrow_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                            copy_id UUID REFERENCES book_copies(copy_id),
                            reader_id UUID REFERENCES readers(reader_id),
                            borrowed_at TIMESTAMP NOT NULL,
                            due_date DATE NOT NULL,
                            returned_at DATE,
                            status VARCHAR(50) DEFAULT 'BORROWED' CHECK (status IN ('BORROWED', 'RETURNED', 'OVERDUE')),
                            fine_amount NUMERIC(10, 2) DEFAULT 0,
                            note TEXT
);


--- Campuses
INSERT INTO campuses (campus_id, name, code, address, created_at) VALUES (gen_random_uuid(), 'Hà Nội', 'HN', 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', CURRENT_TIMESTAMP);
INSERT INTO campuses (campus_id, name, code, address, created_at) VALUES (gen_random_uuid(), 'TP. Hồ Chí Minh', 'HCM', '227 Nguyễn Văn Cừ, Q.5, TP.HCM', CURRENT_TIMESTAMP);
INSERT INTO campuses (campus_id, name, code, address, created_at) VALUES (gen_random_uuid(), 'Đà Nẵng', 'DN', '41 Lê Duẩn, Hải Châu, Đà Nẵng', CURRENT_TIMESTAMP);

--- Libraries
INSERT INTO libraries (library_id, campus_id, name, code, address, created_at) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HN'), 'Thư viện Hà Nội', 'LIB-HN-001', 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội', CURRENT_TIMESTAMP);
INSERT INTO libraries (library_id, campus_id, name, code, address, created_at) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HCM'), 'Thư viện TP. Hồ Chí Minh', 'LIB-HCM-001', '227 Nguyễn Văn Cừ, Q.5, TP.HCM', CURRENT_TIMESTAMP);
INSERT INTO libraries (library_id, campus_id, name, code, address, created_at) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'DN'), 'Thư viện Đà Nẵng', 'LIB-DN-001', '41 Lê Duẩn, Hải Châu, Đà Nẵng', CURRENT_TIMESTAMP);

--- Staff
INSERT INTO staff (staff_id, library_id, name, email, phone, role, created_at, is_active) VALUES (gen_random_uuid(), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'Allison Hill', 'staff1@library.edu.vn', '218.196.0013', 'MANAGER', CURRENT_TIMESTAMP, TRUE);
INSERT INTO staff (staff_id, library_id, name, email, phone, role, created_at, is_active) VALUES (gen_random_uuid(), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), 'Lance Hoffman', 'staff2@library.edu.vn', '001-863-794-0265x423', 'ADMIN', CURRENT_TIMESTAMP, TRUE);
INSERT INTO staff (staff_id, library_id, name, email, phone, role, created_at, is_active) VALUES (gen_random_uuid(), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'Gabrielle Davis', 'staff3@library.edu.vn', '559-407-8161', 'ADMIN', CURRENT_TIMESTAMP, TRUE);
INSERT INTO staff (staff_id, library_id, name, email, phone, role, created_at, is_active) VALUES (gen_random_uuid(), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'Sandra Montgomery', 'staff4@library.edu.vn', '(931)034-1316x475', 'MANAGER', CURRENT_TIMESTAMP, TRUE);
INSERT INTO staff (staff_id, library_id, name, email, phone, role, created_at, is_active) VALUES (gen_random_uuid(), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), 'Henry Santiago', 'staff5@library.edu.vn', '001-192-832-7648x350', 'LIBRARIAN', CURRENT_TIMESTAMP, TRUE);
INSERT INTO staff (staff_id, library_id, name, email, phone, role, created_at, is_active) VALUES (gen_random_uuid(), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'Andrew Stewart', 'staff6@library.edu.vn', '139-537-6724x238', 'ADMIN', CURRENT_TIMESTAMP, TRUE);
INSERT INTO staff (staff_id, library_id, name, email, phone, role, created_at, is_active) VALUES (gen_random_uuid(), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'Nicole Patterson', 'staff7@library.edu.vn', '001-653-287-1012', 'ADMIN', CURRENT_TIMESTAMP, TRUE);
INSERT INTO staff (staff_id, library_id, name, email, phone, role, created_at, is_active) VALUES (gen_random_uuid(), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), 'Rebecca Henderson', 'staff8@library.edu.vn', '669-784-8018', 'ADMIN', CURRENT_TIMESTAMP, TRUE);
INSERT INTO staff (staff_id, library_id, name, email, phone, role, created_at, is_active) VALUES (gen_random_uuid(), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'Patricia Peterson', 'staff9@library.edu.vn', '627-048-2814x8932', 'MANAGER', CURRENT_TIMESTAMP, TRUE);
INSERT INTO staff (staff_id, library_id, name, email, phone, role, created_at, is_active) VALUES (gen_random_uuid(), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'Christopher Ashley', 'staff10@library.edu.vn', '095.701.5430x39117', 'ADMIN', CURRENT_TIMESTAMP, TRUE);
INSERT INTO staff (staff_id, library_id, name, email, phone, role, created_at, is_active) VALUES (gen_random_uuid(), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), 'Vanessa Patel', 'staff11@library.edu.vn', '(278)248-9638', 'MANAGER', CURRENT_TIMESTAMP, TRUE);
INSERT INTO staff (staff_id, library_id, name, email, phone, role, created_at, is_active) VALUES (gen_random_uuid(), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'Melissa Marquez', 'staff12@library.edu.vn', '(578)713-3150x9839', 'MANAGER', CURRENT_TIMESTAMP, TRUE);
INSERT INTO staff (staff_id, library_id, name, email, phone, role, created_at, is_active) VALUES (gen_random_uuid(), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'Benjamin Welch', 'staff13@library.edu.vn', '105.183.4738', 'MANAGER', CURRENT_TIMESTAMP, TRUE);
INSERT INTO staff (staff_id, library_id, name, email, phone, role, created_at, is_active) VALUES (gen_random_uuid(), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), 'Timothy Duncan', 'staff14@library.edu.vn', '376.311.6566x7010', 'ADMIN', CURRENT_TIMESTAMP, TRUE);
INSERT INTO staff (staff_id, library_id, name, email, phone, role, created_at, is_active) VALUES (gen_random_uuid(), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'Gerald Hensley', 'staff15@library.edu.vn', '338.726.2473', 'MANAGER', CURRENT_TIMESTAMP, TRUE);

--- Categories
INSERT INTO categories (category_id, name, description) VALUES (gen_random_uuid(), 'Khoa học máy tính', 'Mô tả cho Khoa học máy tính');
INSERT INTO categories (category_id, name, description) VALUES (gen_random_uuid(), 'Toán học', 'Mô tả cho Toán học');
INSERT INTO categories (category_id, name, description) VALUES (gen_random_uuid(), 'Văn học', 'Mô tả cho Văn học');
INSERT INTO categories (category_id, name, description) VALUES (gen_random_uuid(), 'Lịch sử', 'Mô tả cho Lịch sử');
INSERT INTO categories (category_id, name, description) VALUES (gen_random_uuid(), 'Tâm lý học', 'Mô tả cho Tâm lý học');

--- Books
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Kitchen technology.', 'Amber Kidd', 'Novak and Sons', 2013, '978-1136505587', (SELECT category_id FROM categories WHERE name = 'Khoa học máy tính'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Image loss ten.', 'Carmen Smith', 'Baker-Bowers', 2006, '978-3585650756', (SELECT category_id FROM categories WHERE name = 'Tâm lý học'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Expect recent room situation.', 'Katelyn Lee', 'Novak PLC', 2006, '978-2801823908', (SELECT category_id FROM categories WHERE name = 'Lịch sử'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Article finish anyone live try.', 'Amy Romero', 'Jones Inc', 2018, '978-4733616459', (SELECT category_id FROM categories WHERE name = 'Toán học'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Identify walk now.', 'Amanda Miller', 'Silva, Mills and Donovan', 2022, '978-7110082321', (SELECT category_id FROM categories WHERE name = 'Văn học'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Prove fire enter.', 'Matthew Bryant', 'Smith PLC', 2004, '978-8574149614', (SELECT category_id FROM categories WHERE name = 'Khoa học máy tính'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'You available defense enter value.', 'Sherry Wood', 'Kim PLC', 2002, '978-2631775357', (SELECT category_id FROM categories WHERE name = 'Văn học'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Particularly would pressure.', 'Robert Evans', 'Garcia, Humphrey and Baker', 2011, '978-7887950851', (SELECT category_id FROM categories WHERE name = 'Khoa học máy tính'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Score choice.', 'Daniel Cooper', 'Walters, Baker and Freeman', 2023, '978-9256195745', (SELECT category_id FROM categories WHERE name = 'Khoa học máy tính'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Begin interest.', 'Aaron Wise', 'Whitney, Martin and Ramos', 2017, '978-1298737106', (SELECT category_id FROM categories WHERE name = 'Toán học'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Night born war real.', 'Andrew Wood', 'Hernandez, Anderson and Parker', 2024, '978-5728765136', (SELECT category_id FROM categories WHERE name = 'Văn học'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Together decide.', 'Brian Deleon', 'Dickson-Brady', 2014, '978-2566942273', (SELECT category_id FROM categories WHERE name = 'Văn học'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Ten wish specific.', 'Allison Doyle', 'Patton-Jenkins', 2011, '978-3783290795', (SELECT category_id FROM categories WHERE name = 'Tâm lý học'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Environment skin blue.', 'Shannon Walker', 'Bailey-Hoover', 2020, '978-4131575764', (SELECT category_id FROM categories WHERE name = 'Toán học'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Development process huge.', 'Benjamin Ayala', 'May-Ross', 2014, '978-6924716023', (SELECT category_id FROM categories WHERE name = 'Tâm lý học'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Former agree theory end oil.', 'Mrs. Linda Reed', 'Graham-Joyce', 2007, '978-8235363119', (SELECT category_id FROM categories WHERE name = 'Khoa học máy tính'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'History office.', 'Michael Smith', 'Mcdaniel, Bentley and Mclaughlin', 2007, '978-4529615275', (SELECT category_id FROM categories WHERE name = 'Văn học'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Hair attorney professional.', 'Erik Charles', 'Mccullough, Hunter and Estrada', 2012, '978-2149938334', (SELECT category_id FROM categories WHERE name = 'Toán học'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'I fast camera inside.', 'Megan Orr', 'Carroll, Sullivan and Bass', 2018, '978-2351531223', (SELECT category_id FROM categories WHERE name = 'Lịch sử'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Expert involve oil.', 'Julie Ramos', 'Dixon Ltd', 2012, '978-8055995058', (SELECT category_id FROM categories WHERE name = 'Toán học'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Probably exist professional.', 'Anna Crane', 'Chambers and Sons', 2008, '978-1599707677', (SELECT category_id FROM categories WHERE name = 'Tâm lý học'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Challenge animal worker.', 'Patricia Gibson', 'Johnston, Higgins and Cruz', 2017, '978-7805745017', (SELECT category_id FROM categories WHERE name = 'Tâm lý học'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'During prevent accept seem.', 'Ashley Coleman', 'Brock Ltd', 2012, '978-2554762903', (SELECT category_id FROM categories WHERE name = 'Toán học'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Let newspaper true building card.', 'Joseph Hansen', 'Dodson-Vance', 2016, '978-3119634399', (SELECT category_id FROM categories WHERE name = 'Khoa học máy tính'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Spring throughout interview trade knowledge.', 'Scott Cole', 'Larsen LLC', 2003, '978-8217611860', (SELECT category_id FROM categories WHERE name = 'Tâm lý học'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Machine dream key require doctor.', 'Steven Miller', 'Hall Ltd', 2002, '978-6947530309', (SELECT category_id FROM categories WHERE name = 'Tâm lý học'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Relationship ask imagine.', 'Jennifer Clark', 'Price-Carrillo', 2014, '978-7567496105', (SELECT category_id FROM categories WHERE name = 'Tâm lý học'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Task she.', 'Aaron Bell', 'Castaneda-Ashley', 2000, '978-8519962896', (SELECT category_id FROM categories WHERE name = 'Văn học'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Mrs same son today.', 'Don Tucker MD', 'Shelton, Powell and Martin', 2003, '978-6555540744', (SELECT category_id FROM categories WHERE name = 'Toán học'), CURRENT_TIMESTAMP);
INSERT INTO books (book_id, title, author, publisher, year, isbn, category_id, created_at) VALUES (gen_random_uuid(), 'Try wonder move trade.', 'Mary Miller', 'Taylor-Murray', 2014, '978-8385972235', (SELECT category_id FROM categories WHERE name = 'Tâm lý học'), CURRENT_TIMESTAMP);

--- Book Copies
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-1136505587'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-1-9317', 'RESERVED', 'S1R5', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-1136505587'), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'QR-1-4258', 'AVAILABLE', 'S2R6', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-3585650756'), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'QR-2-9689', 'BORROWED', 'S1R10', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-3585650756'), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), 'QR-2-1319', 'BORROWED', 'S1R6', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-2801823908'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-3-1949', 'AVAILABLE', 'S2R10', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-2801823908'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-3-8962', 'AVAILABLE', 'S1R9', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-4733616459'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-4-8787', 'BORROWED', 'S5R3', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-4733616459'), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'QR-4-7932', 'RESERVED', 'S2R9', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-7110082321'), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'QR-5-4295', 'RESERVED', 'S3R7', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-7110082321'), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'QR-5-7118', 'BORROWED', 'S4R9', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-8574149614'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-6-5061', 'BORROWED', 'S2R2', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-8574149614'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-6-4770', 'AVAILABLE', 'S5R4', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-2631775357'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-7-1964', 'AVAILABLE', 'S2R2', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-2631775357'), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), 'QR-7-2160', 'BORROWED', 'S5R4', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-7887950851'), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'QR-8-8953', 'AVAILABLE', 'S2R9', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-7887950851'), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'QR-8-8744', 'BORROWED', 'S2R8', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-9256195745'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-9-2545', 'BORROWED', 'S1R7', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-9256195745'), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), 'QR-9-7735', 'RESERVED', 'S4R1', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-1298737106'), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'QR-10-2612', 'RESERVED', 'S1R7', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-1298737106'), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), 'QR-10-2790', 'AVAILABLE', 'S2R4', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-5728765136'), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'QR-11-8350', 'AVAILABLE', 'S2R7', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-5728765136'), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), 'QR-11-8579', 'BORROWED', 'S2R2', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-2566942273'), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'QR-12-2604', 'AVAILABLE', 'S1R9', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-2566942273'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-12-4872', 'BORROWED', 'S2R7', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-3783290795'), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), 'QR-13-4502', 'AVAILABLE', 'S4R1', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-3783290795'), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), 'QR-13-1035', 'BORROWED', 'S4R5', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-4131575764'), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), 'QR-14-7930', 'AVAILABLE', 'S5R8', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-4131575764'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-14-5861', 'RESERVED', 'S2R1', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-6924716023'), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'QR-15-9883', 'AVAILABLE', 'S1R6', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-6924716023'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-15-8811', 'AVAILABLE', 'S5R9', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-8235363119'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-16-9320', 'AVAILABLE', 'S1R3', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-8235363119'), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'QR-16-2113', 'AVAILABLE', 'S2R7', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-4529615275'), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'QR-17-5033', 'AVAILABLE', 'S5R10', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-4529615275'), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'QR-17-2343', 'RESERVED', 'S4R10', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-2149938334'), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'QR-18-6183', 'RESERVED', 'S3R4', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-2149938334'), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'QR-18-6147', 'BORROWED', 'S2R5', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-2351531223'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-19-5915', 'AVAILABLE', 'S4R6', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-2351531223'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-19-8508', 'AVAILABLE', 'S5R10', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-8055995058'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-20-9808', 'BORROWED', 'S2R9', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-8055995058'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-20-6718', 'BORROWED', 'S1R4', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-1599707677'), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), 'QR-21-3584', 'RESERVED', 'S4R9', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-1599707677'), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), 'QR-21-9666', 'BORROWED', 'S1R9', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-7805745017'), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'QR-22-2697', 'AVAILABLE', 'S2R5', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-7805745017'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-22-3546', 'RESERVED', 'S3R5', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-2554762903'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-23-6617', 'RESERVED', 'S2R5', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-2554762903'), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), 'QR-23-5114', 'RESERVED', 'S1R2', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-3119634399'), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), 'QR-24-5533', 'BORROWED', 'S1R1', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-3119634399'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-24-5291', 'RESERVED', 'S2R8', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-8217611860'), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'QR-25-8007', 'AVAILABLE', 'S5R1', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-8217611860'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-25-3442', 'BORROWED', 'S5R1', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-6947530309'), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'QR-26-3426', 'AVAILABLE', 'S4R3', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-6947530309'), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), 'QR-26-6974', 'AVAILABLE', 'S1R6', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-7567496105'), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'QR-27-5088', 'RESERVED', 'S1R6', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-7567496105'), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), 'QR-27-3532', 'AVAILABLE', 'S2R3', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-8519962896'), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), 'QR-28-1406', 'BORROWED', 'S2R6', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-8519962896'), (SELECT library_id FROM libraries WHERE code = 'LIB-DN-001'), 'QR-28-5065', 'RESERVED', 'S3R3', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-6555540744'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-29-7267', 'AVAILABLE', 'S1R8', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-6555540744'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-29-8541', 'AVAILABLE', 'S3R5', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-8385972235'), (SELECT library_id FROM libraries WHERE code = 'LIB-HN-001'), 'QR-30-1387', 'BORROWED', 'S2R7', CURRENT_TIMESTAMP);
INSERT INTO book_copies (copy_id, book_id, library_id, qr_code, status, shelf_location, created_at) VALUES (gen_random_uuid(), (SELECT book_id FROM books WHERE isbn = '978-8385972235'), (SELECT library_id FROM libraries WHERE code = 'LIB-HCM-001'), 'QR-30-2137', 'RESERVED', 'S3R6', CURRENT_TIMESTAMP);

--- Readers
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'DN'), 'James Lewis', 'SV030001', 'reader1@student.edu.vn', '564-641-7080x53100', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HCM'), 'Christina Smith', 'SV020002', 'reader2@student.edu.vn', '(327)193-7452', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'DN'), 'Tracey Higgins', 'SV030003', 'reader3@student.edu.vn', '001-241-904-9663x19314', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'DN'), 'Lindsay Martinez', 'SV030004', 'reader4@student.edu.vn', '001-058-651-8506', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HCM'), 'Ashley Yu', 'SV020005', 'reader5@student.edu.vn', '+1-726-284-9877x6945', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HN'), 'Sandra Miller', 'SV010006', 'reader6@student.edu.vn', '379.965.0752x735', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HN'), 'Gina Beard', 'SV010007', 'reader7@student.edu.vn', '001-480-831-3678x377', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HCM'), 'Alan Phillips', 'SV020008', 'reader8@student.edu.vn', '(349)578-8568x5574', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HN'), 'David Griffith', 'SV010009', 'reader9@student.edu.vn', '182-337-4989x41343', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'DN'), 'Eric Erickson', 'SV030010', 'reader10@student.edu.vn', '(400)842-7109', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HCM'), 'John Peterson', 'SV020011', 'reader11@student.edu.vn', '4711671902', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HN'), 'Justin Torres', 'SV010012', 'reader12@student.edu.vn', '186.999.3867', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HN'), 'Elizabeth Chapman', 'SV010013', 'reader13@student.edu.vn', '(499)091-3341x23281', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'DN'), 'Jason Norris', 'SV030014', 'reader14@student.edu.vn', '403.447.1349x3618', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HCM'), 'Chase Baker', 'SV020015', 'reader15@student.edu.vn', '(102)499-4717', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HCM'), 'Melissa Bender', 'SV020016', 'reader16@student.edu.vn', '877.190.6594x01399', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'DN'), 'Yvonne Chambers', 'SV030017', 'reader17@student.edu.vn', '902-787-4296x717', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HCM'), 'Gary Santiago', 'SV020018', 'reader18@student.edu.vn', '(567)468-0715', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HCM'), 'Brian Barton', 'SV020019', 'reader19@student.edu.vn', '087.603.8597x70348', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'DN'), 'Dwayne Gilmore', 'SV030020', 'reader20@student.edu.vn', '109.324.8086x1317', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'DN'), 'Maria Moore', 'SV030021', 'reader21@student.edu.vn', '001-484-677-3782x639', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HN'), 'Sherry Shields', 'SV010022', 'reader22@student.edu.vn', '658-404-4997x278', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HCM'), 'Mr. Phillip Bennett', 'SV020023', 'reader23@student.edu.vn', '339-636-0576x62702', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'DN'), 'Leslie Kane', 'SV030024', 'reader24@student.edu.vn', '187.026.2174x596', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HN'), 'Sarah Phelps', 'SV010025', 'reader25@student.edu.vn', '+1-657-809-1343', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HCM'), 'Jessica Garcia', 'SV020026', 'reader26@student.edu.vn', '+1-172-400-5045x5623', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HN'), 'Kylie Sparks', 'SV010027', 'reader27@student.edu.vn', '(219)693-7923', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'DN'), 'David Scott', 'SV030028', 'reader28@student.edu.vn', '7482175946', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HCM'), 'Joyce Turner', 'SV020029', 'reader29@student.edu.vn', '(713)695-9440x6409', CURRENT_TIMESTAMP, TRUE);
INSERT INTO readers (reader_id, campus_id, name, student_id, email, phone, registered_at, is_active) VALUES (gen_random_uuid(), (SELECT campus_id FROM campuses WHERE code = 'HN'), 'Paula Beltran', 'SV010030', 'reader30@student.edu.vn', '+1-743-953-3942x104', CURRENT_TIMESTAMP, TRUE);

--- Borrowings (This section needs careful mapping for copy_id and reader_id)
-- Note: Since the original `copy_id` and `reader_id` values were integers,
-- and they are now UUIDs, direct mapping isn't possible without a lookup table
-- or regenerating the entire dataset with proper UUID associations.
-- For demonstration, I will assume a way to look up the new UUIDs based on old logic,
-- or that you would handle this mapping in your application layer.
-- The `(SELECT copy_id FROM book_copies WHERE qr_code = 'QR-X-YYYY')` and
-- `(SELECT reader_id FROM readers WHERE student_id = 'SVXXZZZZ')` are placeholders
-- for how you might retrieve the new UUIDs based on unique identifiers from the original data.

INSERT INTO borrowings (borrow_id, copy_id, reader_id, borrowed_at, due_date, returned_at, status, fine_amount, note) VALUES (gen_random_uuid(), (SELECT copy_id FROM book_copies WHERE qr_code = 'QR-17-2343'), (SELECT reader_id FROM readers WHERE student_id = 'SV010030'), '2025-07-11', '2025-07-25', '2025-07-22', 'RETURNED', 0, NULL);
INSERT INTO borrowings (borrow_id, copy_id, reader_id, borrowed_at, due_date, returned_at, status, fine_amount, note) VALUES (gen_random_uuid(), (SELECT copy_id FROM book_copies WHERE qr_code = 'QR-12-4872'), (SELECT reader_id FROM readers WHERE student_id = 'SV030014'), '2025-07-02', '2025-07-16', '2025-07-09', 'RETURNED', 0, NULL);
INSERT INTO borrowings (borrow_id, copy_id, reader_id, borrowed_at, due_date, returned_at, status, fine_amount, note) VALUES (gen_random_uuid(), (SELECT copy_id FROM book_copies WHERE qr_code = 'QR-22-2697'), (SELECT reader_id FROM readers WHERE student_id = 'SV010030'), '2025-06-22', '2025-07-06', NULL, 'OVERDUE', 6.61, NULL);
INSERT INTO borrowings (borrow_id, copy_id, reader_id, borrowed_at, due_date, returned_at, status, fine_amount, note) VALUES (gen_random_uuid(), (SELECT copy_id FROM book_copies WHERE qr_code = 'QR-22-2697'), (SELECT reader_id FROM readers WHERE student_id = 'SV030028'), '2025-07-06', '2025-07-20', '2025-07-14', 'RETURNED', 0, NULL);
INSERT INTO borrowings (borrow_id, copy_id, reader_id, borrowed_at, due_date, returned_at, status, fine_amount, note) VALUES (gen_random_uuid(), (SELECT copy_id FROM book_copies WHERE qr_code = 'QR-24-5533'), (SELECT reader_id FROM readers WHERE student_id = 'SV020029'), '2025-06-30', '2025-07-14', '2025-07-14', 'RETURNED', 0, NULL);
INSERT INTO borrowings (borrow_id, copy_id, reader_id, borrowed_at, due_date, returned_at, status, fine_amount, note) VALUES (gen_random_uuid(), (SELECT copy_id FROM book_copies WHERE qr_code = 'QR-17-5033'), (SELECT reader_id FROM readers WHERE student_id = 'SV030010'), '2025-07-09', '2025-07-23', NULL, 'OVERDUE', 3.94, NULL);
INSERT INTO borrowings (borrow_id, copy_id, reader_id, borrowed_at, due_date, returned_at, status, fine_amount, note) VALUES (gen_random_uuid(), (SELECT copy_id FROM book_copies WHERE qr_code = 'QR-23-6617'), (SELECT reader_id FROM readers WHERE student_id = 'SV030010'), '2025-06-25', '2025-07-09', '2025-07-04', 'RETURNED', 0, NULL);
INSERT INTO borrowings (borrow_id, copy_id, reader_id, borrowed_at, due_date, returned_at, status, fine_amount, note) VALUES (gen_random_uuid(), (SELECT copy_id FROM book_copies WHERE qr_code = 'QR-7-1964'), (SELECT reader_id FROM readers WHERE student_id = 'SV030014'), '2025-06-24', '2025-07-08', NULL, 'OVERDUE', 7.1, NULL);
INSERT INTO borrowings (borrow_id, copy_id, reader_id, borrowed_at, due_date, returned_at, status, fine_amount, note) VALUES (gen_random_uuid(), (SELECT copy_id FROM book_copies WHERE qr_code = 'QR-29-8541'), (SELECT reader_id FROM readers WHERE student_id = 'SV010006'), '2025-06-29', '2025-07-13', '2025-07-13', 'RETURNED', 0, NULL);
INSERT INTO borrowings (borrow_id, copy_id, reader_id, borrowed_at, due_date, returned_at, status, fine_amount, note) VALUES (gen_random_uuid(), (SELECT copy_id FROM book_copies WHERE qr_code = 'QR-13-1035'), (SELECT reader_id FROM readers WHERE student_id = 'SV020018'), '2025-06-29', '2025-07-13', '2025-07-04', 'RETURNED', 0, NULL);
INSERT INTO borrowings (borrow_id, copy_id, reader_id, borrowed_at, due_date, returned_at, status, fine_amount, note) VALUES (gen_random_uuid(), (SELECT copy_id FROM book_copies WHERE qr_code = 'QR-10-2790'), (SELECT reader_id FROM readers WHERE student_id = 'SV030010'), '2025-07-10', '2025-07-24', '2025-07-21', 'RETURNED', 0, NULL);
INSERT INTO borrowings (borrow_id, copy_id, reader_id, borrowed_at, due_date, returned_at, status, fine_amount, note) VALUES (gen_random_uuid(), (SELECT copy_id FROM book_copies WHERE qr_code = 'QR-14-5861'), (SELECT reader_id FROM readers WHERE student_id = 'SV020026'), '2025-07-02', '2025-07-16', NULL, 'OVERDUE', 5.18, NULL);
INSERT INTO borrowings (borrow_id, copy_id, reader_id, borrowed_at, due_date, returned_at, status, fine_amount, note) VALUES (gen_random_uuid(), (SELECT copy_id FROM book_copies WHERE qr_code = 'QR-15-9883'), (SELECT reader_id FROM readers WHERE student_id = 'SV010022'), '2025-06-26', '2025-07-10', '2025-07-07', 'RETURNED', 0, NULL);
INSERT INTO borrowings (borrow_id, copy_id, reader_id, borrowed_at, due_date, returned_at, status, fine_amount, note) VALUES (gen_random_uuid(), (SELECT copy_id FROM book_copies WHERE qr_code = 'QR-17-5033'), (SELECT reader_id FROM readers WHERE student_id = 'SV020016'), '2025-06-26', '2025-07-10', '2025-07-06', 'RETURNED', 0, NULL);
INSERT INTO borrowings (borrow_id, copy_id, reader_id, borrowed_at, due_date, returned_at, status, fine_amount, note) VALUES (gen_random_uuid(), (SELECT copy_id FROM book_copies WHERE qr_code = 'QR-22-2697'), (SELECT reader_id FROM readers WHERE student_id = 'SV030003'), '2025-06-25', '2025-07-09', '2025-07-09', 'RETURNED', 0, NULL);
INSERT INTO borrowings (borrow_id, copy_id, reader_id, borrowed_at, due_date, returned_at, status, fine_amount, note) VALUES (gen_random_uuid(), (SELECT copy_id FROM book_copies WHERE qr_code = 'QR-17-5033'), (SELECT reader_id FROM readers WHERE student_id = 'SV010022'), '2025-07-11', '2025-07-25', NULL, 'OVERDUE', 1.84, NULL);
INSERT INTO borrowings (borrow_id, copy_id, reader_id, borrowed_at, due_date, returned_at, status, fine_amount, note) VALUES (gen_random_uuid(), (SELECT copy_id FROM book_copies WHERE qr_code = 'QR-25-8007'), (SELECT reader_id FROM readers WHERE student_id = 'SV020008'), '2025-07-05', '2025-07-19', '2025-07-19', 'RETURNED', 0, NULL);
INSERT INTO borrowings (borrow_id, copy_id, reader_id, borrowed_at, due_date, returned_at, status, fine_amount, note) VALUES (gen_random_uuid(), (SELECT copy_id FROM book_copies WHERE qr_code = 'QR-8-8953'), (SELECT reader_id FROM readers WHERE student_id = 'SV020026'), '2025-06-30', '2025-07-14', '2025-07-11', 'RETURNED', 0, NULL);
INSERT INTO borrowings (borrow_id, copy_id, reader_id, borrowed_at, due_date, returned_at, status, fine_amount, note) VALUES (gen_random_uuid(), (SELECT copy_id FROM book_copies WHERE qr_code = 'QR-5-7118'), (SELECT reader_id FROM readers WHERE student_id = 'SV030001'), '2025-07-04', '2025-07-18', '2025-07-10', 'RETURNED', 0, NULL);
