# Luồng Hoạt Động Của Server

## 1. Khởi Động Server
- Server khởi động thông qua module chính (main.ts)
- Khởi tạo các global middleware, filters, guards và interceptors từ Core Module
- Tải các module cần thiết và thiết lập kết nối database thông qua MikroORM

## 2. Xử Lý Request
### 2.1. Luồng Request Cơ Bản
1. Request đến server
2. Global Middleware xử lý (logging, parsing, etc.)
3. Guard kiểm tra authentication/authorization
4. Route được định tuyến đến Controller phù hợp
5. Interceptor xử lý trước khi vào Controller
6. Controller nhận request
7. DTO validation cho input data
8. Service xử lý business logic
9. Tương tác với database qua Entity
10. Trả về response
11. Interceptor xử lý response
12. Response về client

### 2.2. Luồng Xử Lý Exception
1. Exception phát sinh trong quá trình xử lý
2. Global Exception Filter bắt exception
3. Transform exception thành response format chuẩn
4. Trả về error response cho client

## 3. Module Flow
### 3.1. API Module
1. Request đến API Module
2. Controller của module tiếp nhận request
3. Validate input data qua DTO
4. Gọi đến Service tương ứng
5. Service thực hiện business logic
6. Tương tác với Entity để CRUD data
7. Trả về kết quả cho Controller
8. Controller format response và trả về

### 3.2. Shared Module Flow
1. Các module khác import Shared Module
2. Sử dụng các utility functions
3. Sử dụng shared business logic
4. Sử dụng shared services

### 3.3. Core Module Flow
1. Đăng ký các global components
2. Xử lý cross-cutting concerns
3. Quản lý authentication/authorization
4. Xử lý logging và monitoring

## 4. Testing Flow
### 4.1. Unit Testing
1. Setup test environment
2. Mock dependencies
3. Arrange test data
4. Act - thực thi function cần test
5. Assert - kiểm tra kết quả

### 4.2. E2E Testing
1. Setup test database
2. Khởi tạo test server
3. Gửi test request
4. Verify response
5. Cleanup test data

### 4.3. Smoke Testing
1. Gọi admin/test endpoint của mỗi controller
2. Verify health check
3. Verify basic functionality

## 5. Database Flow
### 5.1. Entity Management
1. Define Entity schema
2. Migration handling
3. CRUD operations
4. Transaction management
5. Data validation

### 5.2. Repository Pattern
1. Repository nhận request từ Service
2. Transform business object sang database model
3. Thực hiện database operation
4. Transform database result sang business object
5. Trả về kết quả cho Service

## 6. Security Flow
### 6.1. Authentication
1. Client gửi credentials
2. Validate credentials
3. Generate JWT token
4. Return token cho client
5. Subsequent requests sử dụng token

### 6.2. Authorization
1. Guard kiểm tra JWT token
2. Verify permissions
3. Allow/Deny access to resources
4. Log security events

## 7. Error Handling Flow
1. Try-catch blocks trong business logic
2. Exception throwing khi gặp lỗi
3. Exception Filter bắt lỗi
4. Transform thành error response
5. Log error details
6. Return error cho client

## 8. Logging Flow
1. Request logging
2. Business operation logging
3. Error logging
4. Performance metrics logging
5. Security event logging

## 9. Caching Flow
1. Check cache trước khi xử lý request
2. Return cached data nếu có
3. Process request nếu không có cache
4. Update cache với data mới
5. Return response

## 10. Validation Flow
1. DTO validation cho input data
2. Business rule validation trong Service
3. Database constraint validation
4. Custom validation rules
5. Return validation errors
