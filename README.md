# ExpenseTracker: A Smarter Way to Track Expenses

This project is a web application which allows an individual to track their monthly expenses to determine where their money is being spent and how their spending habits change over time.

**Link to project:** https://expense-tracker-tt.herokuapp.com/

Use demo login: `demo@testing.com` / `testingtesting`

## How It's Made:

**Tech used:** NodeJS, Express, PassportJS, EJS, Javascript, HTML, CSS

This is a full-stack application consisting of a NodeJS/Express server using PassportJS for authentication, EJS as a view engine, and HTML/CSS/Javascript for an interactive front-end.

This project was originally written in PHP/MySQL as my final project in the Computer Programming and Analysis curriculum at Seminole State College. Once I decided to concentrate on Javascript, however, I decided to rewrite the application using NodeJS/Express/MongoDB. This also gave me the opportunity to refresh the look and add some additional features, such as the charts on the reports page.

# Features:

- Local user authentication.
- Create, update and remove expenses.
- Assign expenses to a category.
- Assign expenses to an account.
- Add, edit, and remove accounts.
- View and print monthly reports with expenses by category and by account, including a pie chart showing the percentage of the top 5 categories/accounts.
- Update user settings for display name, date format, number format and currency symbol.

## Lessons Learned:

- Dealing with various currency and date formats is pretty involved -- luckily, I found `dayjs()` to help with the date formatting, and used Javascript's `Intl.NumberFormat`, part of the Internationalization API, to help with the currency formatting.
- I wanted to implement the front-end with EJS and vanilla Javascript, but I found myself missing the organization of React quite a bit.

## Additional Feature Ideas:

- Add line chart option to reports to show how total spending changes over time.
- Utilize modals for confirmation dialogs for deleting expenses/accounts
