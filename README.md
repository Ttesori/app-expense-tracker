# ExpenseTracker: A Smarter Way to Track Expenses

This project is a web application which allows an individual to track their monthly expenses to determine where their money is being spent and how their spending habits change over time.

**Link to project:** https://expense-tracker-tt.herokuapp.com/

Use demo login: `testing@testing.com` / `testingtesting`

## How It's Made:

**Tech used:** NodeJS, Express, PassportJS, EJS, Javascript, HTML, CSS

This is a full-stack application consisting of a NodeJS/Express server using PassportJS for authentication, EJS as a view engine, and HTML/CSS/Javascript for an interactive front-end.

# Features:

- Local user authentication.
- Create, update and remove expenses.
- Assign expenses to a category.
- Assign expenses to an account.
- Add, edit, and remove accounts.
- View and print monthly reports with expenses by category and by account.
- Update user settings for display name, date format, number format and currency symbol.

## Lessons Learned:

- Dealing with various currency and date formats is pretty involved -- luckily, I found `dayjs()` to help with the date formatting, and used Javascript's `Intl.NumberFormat`, part of the Internationalization API, to help with the currency formatting.
- I wanted to implement the front-end with EJS and vanilla Javascript, but I found myself missing the organization of React quite a bit.
