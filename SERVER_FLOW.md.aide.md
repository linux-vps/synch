# Luồng Hoạt Động Của Server

## 1. Khởi Động Server
- Server khởi động thông qua module chính (main.ts) // Main entry point of the server application
- Khởi tạo các global middleware, filters, guards và interceptors từ Core Module // Setting up global components for the entire application
- Tải các module cần thiết và thiết lập kết nối database thông qua MikroORM // Loading necessary modules and establishing database connections

## 2. Xử Lý Request
### 2.1. Luồng Request Cơ Bản
1. Request đến server // Client sends a request to the server
2. Global Middleware xử lý (logging, parsing, etc.) // Global middleware processes the request (logging, parsing, etc.)
3. Guard kiểm tra authentication/authorization // Guards check authentication and authorization
4. Route được định tuyến đến Controller phù hợp // Router direct the request to the appropriate controller
5. Interceptor xử lý trước khi vào Controller // Interceptors process the request before it enters the controller
6. Controller nhận request // Controller receives the request
7. DTO validation cho input data // DTO validates the input data
8. Service xử lý business logic // Services process the business logic
9. Tương tác với database qua Entity // Entities interact with the database for CRUD operations
10. Trả về response // Return a response to the client
11. Interceptor xử lý response // Interceptors process the response before it is sent to the client
12. Response về client // Response is sent back to the client

### 2.2. Luồng Xử Lý Exception
1. Exception phát sinh trong quá trình xử lý // An exception occurs during request processing
2. Global Exception Filter bắt exception // Global exception filter catches the exception
3. Transform exception thành response format chuẩn // The exception is transformed into a standard response format
4. Trả về error response cho client // Return an error response to the client

## 3. Module Flow
### 3.1. API Module
1. Request đến API Module // A request reaches the API module
2. Controller của module tiếp nhận request // Module's controller receives the request
3. Validate input data qua DTO // Input data is validated via DTO
4. Gọi đến Service tương ứng // Calls the corresponding service
5. Service thực hiện business logic // Service processes the business logic
6. Tương tác với Entity để CRUD data // Entities interact with the database to perform CRUD operations
7. Trả về kết quả cho Controller // Return results to the controller
8. Controller format response và trả về // Controller formats the response and returns it

### 3.2. Shared Module Flow
1. Các module khác import Shared Module // Other modules import the Shared Module
2. Sử dụng các utility functions // Use utility functions
3. Sử dụng shared business logic // Use shared business logic
4. Sử dụng shared services // Use shared services

### 3.3. Core Module Flow
1. Đăng ký các global components // Register global components
2. Xử lý cross-cutting concerns // Handle cross-cutting concerns
3. Quản lý authentication/authorization // Manage authentication and authorization
4. Xử lý logging và monitoring // Handle logging and monitoring

## 4. Testing Flow
### 4.1. Unit Testing
1. Setup test environment // Set up the test environment
2. Mock dependencies // Mock dependencies
3. Arrange test data // Arrange test data
4. Act - thực thi function cần test // Act - execute the function to be tested
5. Assert - kiểm tra kết quả // Assert - check the results

### 4.2. E2E Testing
1. Setup test database // Set up the test database
2. Khởi tạo test server // Initialize the test server
3. Gửi test request // Send a test request
4. Verify response // Verify the response
5. Cleanup test data // Clean up the test data

### 4.3. Smoke Testing
1. Gọi admin/test endpoint của mỗi controller // Call each controller's admin/test endpoint
2. Verify health check // Verify health check
3. Verify basic functionality // Verify basic functionality

## 5. Database Flow
### 5.1. Entity Management
1. Define Entity schema // Define entity schema
2. Migration handling // Handle migrations
3. CRUD operations // Perform CRUD operations
4. Transaction management // Manage transactions
5. Data validation // Validate data

### 5.2. Repository Pattern
1. Repository nhận request từ Service // Repository receives a request from the service
2. Transform business object sang database model // Transform business objects to database models
3. Thực hiện database operation // Perform database operations
4. Transform database result sang business object // Transform database results to business objects
5. Trả về kết quả cho Service // Return results to the service

## 6. Security Flow
### 6.1. Authentication
1. Client gửi credentials // Client sends credentials
2. Validate credentials // Validate credentials
3. Generate JWT token // Generate JWT token
4. Return token cho client // Return token to the client
5. Subsequent requests sử dụng token // Subsequent requests use the token

### 6.2. Authorization
1. Guard kiểm tra JWT token // Guards check JWT token
2. Verify permissions // Verify permissions
3. Allow/Deny access to resources // Allow or deny access to resources
4. Log security events // Log security events

## 7. Error Handling Flow
1. Try-catch blocks trong business logic // Try-catch blocks in business logic
2. Exception throwing khi gặp lỗi // Exception is thrown when an error occurs
3. Exception Filter bắt lỗi // Exception filter catches the error
4. Transform thành error response // Error is transformed into an error response
5. Log error details // Log error details
6. Return error cho client // Return error to the client

## 8. Logging Flow
1. Request logging // Log requests
2. Business operation logging // Log business operations
3. Error logging // Log errors
4. Performance metrics logging // Log performance metrics
5. Security event logging // Log security events

## 9. Caching Flow
1. Check cache trước khi xử lý request // Check cache before processing the request
2. Return cached data nếu có // Return cached data if available
3. Process request nếu không có cache // Process the request if cache is not available
4. Update cache với data mới // Update cache with new data
5. Return response // Return response

## 10. Validation Flow
1. DTO validation cho input data // Validate input data via DTO
2. Business rule validation trong Service // Validate business rules in services
3. Database constraint validation // Validate database constraints
4. Custom validation rules // Custom validation rules
5. Return validation errors // Return validation errors