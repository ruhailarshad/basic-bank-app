'use strict';

// BANK APP

// Data
const account1 = {
  owner: 'Ruhail Arshad',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Monis Mazher',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'S M Salman',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Hamza Ali',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// labels
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

//app container
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

//buttons
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

//inputs
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//displaying records of transactions
const movementDisplay = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const movementHtml = `<div class="movements__row">
  <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
  <div class="movements__value">${mov}</div>
</div>`;
    containerMovements.insertAdjacentHTML('afterbegin', movementHtml);
  });
};

//update ui
const updateUI = function (accounts) {
  movementDisplay(accounts.movements);
  calDisplayBalance(accounts);
  calDisplaySummary(accounts);
};

//total balance
const calDisplayBalance = function (accounts) {
  accounts.balance = accounts.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${accounts.balance}€`;
};

//summary income out interest
const calDisplaySummary = function (accounts) {
  const incomes = accounts.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const outcomes = accounts.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  const interest = accounts.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * accounts.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumIn.textContent = `${incomes}€`;
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;
  labelSumInterest.textContent = `${interest}€`;
};

//creating username
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

//login system
let currentAcount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAcount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAcount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome Back,${
      currentAcount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(currentAcount);
  }
});
//transfer

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    currentAcount.balance >= amount &&
    receiverAcc?.username !== currentAcount.username &&
    receiverAcc
  ) {
    currentAcount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAcount);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});
//loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAcount.movements.some(mov => mov >= amount * 0.1)) {
    currentAcount.movements.push(amount);
    updateUI(currentAcount);
  }
  inputLoanAmount.value = '';
});
//close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAcount.username === inputCloseUsername.value &&
    currentAcount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      arr => arr.username === currentAcount.username
    );
    accounts.splice(index, 1);
    inputCloseUsername.value = inputClosePin.value = '';
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
});
//sort
let sorted = true;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  movementDisplay(currentAcount.movements, sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
