## Description

- Lưu domain, token vào CSDL mongodb
- Lưu google token vào CSDL,
- Cấp quyền cho app để truy cập google sheet
- Refresh token

khi tương tác với google sheet hay crm đều cần truyền thêm config vào request
 ```bash
 ### Thêm một liên hệ mới vào crm
POST http://localhost:3000/test/contact/add
Content-Type: application/json

{
  "config": {
    "oauth": {
      "domain": "domain",
      "refresh_token": "refresh_token",
      "access_token": "access_token"
    }
  },
  "fields": {
    "NAME": "Van A",
    "LAST_NAME": "Nguyen"
  }
}

### Tạo mới Google Spreadsheet
# Tạo spreadsheet với tiêu đề và các sheet mặc định (google-sheet.service.ts phần SHEET_CONFIGS)
POST http://localhost:3000/google-sheet/create
Content-Type: application/json

{
    "title": "Test create Spreadsheet",
    "config": {
        "access_token":"xxxxx",
        "refresh_token":"xxxxx",
        "scope":"https://www.googleapis.com/auth/spreadsheets",
        "token_type":"Bearer",
        "expiry_date":1733388882369
    }
}
 ```

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
