# Biểu Đồ Trình Tự Đồng Bộ

## 1. Đồng Bộ Bitrix24 sang Google Sheet
```plantuml
@startuml
title Đồng Bộ Dữ Liệu Bitrix24 sang Google Sheet

actor "Admin" as admin
boundary "BitrixController" as bitrixCtrl
control "TokenRefreshService" as tokenSrv
control "BitrixServiceFactory" as bitrixFactory
control "BitrixService" as bitrixSrv
control "ContactService" as contactSrv
control "CompanyService" as companySrv
control "GoogleSheetServiceFactory" as sheetFactory
control "GoogleSheetService" as sheetSrv
control "GoogleSheetConnector" as sheetCon
database "PostgreSQL" as db
participant "Bitrix24 API" as bitrixApi
participant "Google Sheets API" as googleApi

== 1. Khởi tạo và Verify Token ==
admin -> bitrixCtrl: 1. Yêu cầu đồng bộ()
bitrixCtrl -> tokenSrv: 2. verifyTokens()
tokenSrv -> bitrixApi: 3. Verify Bitrix Token
tokenSrv -> googleApi: 4. Verify Google Token

alt Token hết hạn
    tokenSrv -> bitrixApi: 5. Refresh Bitrix Token
    tokenSrv -> googleApi: 6. Refresh Google Token
    tokenSrv -> db: 7. Update Tokens
end

== 2. Khởi tạo Services ==
bitrixCtrl -> bitrixFactory: 8. createService(config)
bitrixFactory -> bitrixSrv: 9. new BitrixService()
bitrixCtrl -> sheetFactory: 10. createService(config)
sheetFactory -> sheetSrv: 11. new GoogleSheetService()

== 3. Lấy Dữ liệu từ Bitrix24 ==
bitrixSrv -> contactSrv: 12. getContacts()
contactSrv -> bitrixApi: 13. crm.contact.list()
bitrixApi --> contactSrv: 14. Contact Data

bitrixSrv -> companySrv: 15. getCompanies()
companySrv -> bitrixApi: 16. crm.company.list()
bitrixApi --> companySrv: 17. Company Data

== 4. Transform và Lưu trữ ==
contactSrv -> bitrixSrv: 18. Transform Contact Data
companySrv -> bitrixSrv: 19. Transform Company Data
bitrixSrv -> db: 20. Lưu dữ liệu đã transform()

== 5. Cập nhật Google Sheet ==
bitrixSrv -> sheetSrv: 21. updateSheet(data)
sheetSrv -> sheetCon: 22. formatSheetData()
sheetCon -> googleApi: 23. sheets.spreadsheets.values.update()
googleApi --> sheetCon: 24. Update Result
sheetCon --> sheetSrv: 25. Status
sheetSrv -> db: 26. Lưu log đồng bộ()

== 6. Xử lý Lỗi ==
control "ErrorHandler" as error
database "SyncLogRepository" as syncLog

alt Lỗi Token
    tokenSrv -> error: 27. Token Invalid/Expired
    error -> syncLog: 28. Log Token Error
    error -> tokenSrv: 29. Request Re-auth
else Lỗi API Bitrix
    bitrixApi --> error: 30. API Error
    error -> syncLog: 31. Log Error Details
    error -> bitrixSrv: 32. Retry Logic
else Lỗi Transform
    bitrixSrv -> error: 33. Transform Error
    error -> syncLog: 34. Log Transform Error
else Lỗi Google Sheet
    googleApi --> error: 35. Sheet Error
    error -> syncLog: 36. Log Sheet Error
    error -> sheetSrv: 37. Retry Update
end

@enduml
```

## 2. Đồng Bộ Google Sheet sang Bitrix24
```plantuml
@startuml
title Đồng Bộ Dữ Liệu Google Sheet sang Bitrix24

actor "Admin" as admin
boundary "GoogleSheetController" as sheetCtrl
control "GoogleSheetServiceFactory" as sheetFactory
control "GoogleSheetService" as sheetSrv
control "GoogleSheetConnector" as sheetCon
control "BitrixServiceFactory" as bitrixFactory
control "BitrixService" as bitrixSrv
control "ContactService" as contactSrv
control "CompanyService" as companySrv
database "PostgreSQL" as db
participant "Google Sheets API" as googleApi
participant "Bitrix24 API" as bitrixApi

== 1. Khởi tạo và Lấy Dữ liệu ==
admin -> sheetCtrl: 1. Yêu cầu đồng bộ()
sheetCtrl -> sheetFactory: 2. createService(config)
sheetFactory -> sheetSrv: 3. new GoogleSheetService()
sheetSrv -> sheetCon: 4. getSheetData()
sheetCon -> googleApi: 5. sheets.spreadsheets.values.get()
googleApi --> sheetCon: 6. Sheet Data
sheetCon -> sheetSrv: 7. Raw Data

== 2. Validate và Transform ==
sheetSrv -> sheetSrv: 8. validateData()
alt Dữ liệu Contact
    sheetSrv -> sheetSrv: 9. transformToContactFormat()
else Dữ liệu Company
    sheetSrv -> sheetSrv: 10. transformToCompanyFormat()
end
sheetSrv -> db: 11. Lưu dữ liệu tạm()
db --> sheetSrv: 12. Save Success

== 3. Cập nhật Bitrix24 ==
sheetSrv -> bitrixFactory: 13. createService(config)
bitrixFactory -> bitrixSrv: 14. new BitrixService()

alt Cập nhật Contact
    bitrixSrv -> contactSrv: 15. batchUpdate(contacts)
    contactSrv -> bitrixApi: 16. crm.contact.batch.update()
    bitrixApi --> contactSrv: 17. Update Results
else Cập nhật Company
    bitrixSrv -> companySrv: 18. batchUpdate(companies)
    companySrv -> bitrixApi: 19. crm.company.batch.update()
    bitrixApi --> companySrv: 20. Update Results
end

== 4. Xử lý Kết quả ==
bitrixSrv -> sheetSrv: 21. Sync Results
sheetSrv -> sheetCon: 22. updateSyncStatus()
sheetCon -> googleApi: 23. Update Status Cells()
googleApi --> sheetCon: 24. Update Complete
sheetSrv -> db: 25. Lưu log đồng bộ()
sheetSrv --> sheetCtrl: 26. Sync Complete
sheetCtrl --> admin: 27. Thông báo hoàn thành

== 5. Xử lý Lỗi ==
control "ErrorHandler" as error
database "SyncLogRepository" as syncLog

alt Lỗi Dữ liệu
    sheetSrv -> error: 28. Data Validation Error
    error -> sheetCon: 29. Mark Error Cells()
    sheetCon -> googleApi: 30. Update Error Cells()
else Lỗi Transform
    sheetSrv -> error: 31. Transform Error
    error -> syncLog: 32. Log Transform Error
else Lỗi API Bitrix
    bitrixApi --> error: 33. API Error
    error -> syncLog: 34. Log Error Details
    error -> bitrixSrv: 35. Retry Logic()
end

@enduml
