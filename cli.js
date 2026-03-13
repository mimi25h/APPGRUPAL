const readline = require('readline');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { connectToMongo } = require('./config/db');
const People = require('./modules/people/schemas');
const Users = require('./modules/users/schemas');
const Orgs = require('./modules/organizations/schemas');
// bring in validators and helper from express-validator
const { createPeopleValidator } = require('./modules/people/validators');
const { createUserValidator } = require('./modules/users/validators');
const { createOrganizationValidator } = require('./modules/organizations/validators');
const { validationResult } = require('express-validator');
require('dotenv').config({ path: './config/.env' });



async function startApp() {
  const result = await connectToMongo(process.env.MONGO_URI);

  if (!result.ok) {
    console.error("MongoDB connection failed:", result.error);
    process.exit(1);
  }

  console.log("MongoDB connected");
  await mainMenu();
}

startApp();



const SESSION_PATH = path.join(__dirname, 'session.json');

function loadSession() {
  try {
    if (fs.existsSync(SESSION_PATH)) {
      const data = fs.readFileSync(SESSION_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    // ignore
  }
  return {};
}

function saveSession(session) {
  try {
    fs.writeFileSync(SESSION_PATH, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save session:', e.message);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}





// SECTION TO CREATE PERSON STARTS HERE
async function createPerson() {
    console.log('Connected to MongoDB');

    console.log('\n=== Create New Person ===\n');

    // Required fields
    const document = await question('Document (required): ');
    if (!document.trim()) {
      console.log('Document is required');
      return;
    }

    const name_01 = await question('First Name (required): ');
    if (!name_01.trim()) {
      console.log('First name is required');
      return;
    }

    const surname_01 = await question('First Surname (required): ');
    if (!surname_01.trim()) {
      console.log('First surname is required');
      return;
    }

    const birth_date_str = await question('Birth Date (YYYY-MM-DD or YYYY MM DD, required): ');
    let birth_date;
    if (birth_date_str.includes(' ')) {
      // Handle YYYY MM DD format
      const parts = birth_date_str.trim().split(/\s+/);
      if (parts.length === 3) {
        const [year, month, day] = parts;
        birth_date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      } else {
        birth_date = new Date(birth_date_str);
      }
    } else {
      birth_date = new Date(birth_date_str);
    }
    
    if (isNaN(birth_date.getTime())) {
      console.log('Invalid date format. Use YYYY-MM-DD or YYYY MM DD');
      return;
    }

    // Optional fields
    const name_02 = await question('Second Name (optional): ');
    const surname_02 = await question('Second Surname (optional): ');

    const gender_str = await question('Gender (0=Male, 1=Female, optional): ');
    const gender = gender_str.trim() ? parseInt(gender_str) : undefined;

    const phone_str = await question('Phone Numbers (comma-separated, optional): ');
    const phone_numbers = phone_str.trim() ? phone_str.split(',').map(p => p.trim()) : [];

    // Create person object
    const personData = {
      document: document.trim(),
      name_01: name_01.trim(),
      surname_01: surname_01.trim(),
      birth_date
    };

    if (name_02.trim()) personData.name_02 = name_02.trim();
    if (surname_02.trim()) personData.surname_02 = surname_02.trim();
    if (gender !== undefined && !isNaN(gender)) personData.gender = gender;
    if (phone_numbers.length > 0) personData.phone_numbers = phone_numbers;
    // run express-validator rules against our input
    const fakeReq = { body: personData };
    for (const rule of createPeopleValidator) {
      await rule.run(fakeReq);
    }
    const errors = validationResult(fakeReq);
    if (!errors.isEmpty()) {
      console.log('\nValidation errors:');
      errors.array().forEach(err => {
        console.log(` - ${err.param}: ${err.msg}`);
      });
      return;
    }
    // Save to database
    const person = new People(personData);
    await person.save();

    console.log('\n Person created successfully!');
    console.log('ID:', person._id);
}
// SECTION TO CREATE PERSON ENDS HERE






async function createUser() {
    //if they *somehow* entered without logging in, stop them
  if (!loggedInId) {
    console.log('You must be logged in to create a user');
    return;
  }

  try {
    console.log('\n=== Create New User ===\n');

    // Required fields
    const username = await question('Username (required): ');
    if (!username.trim()) {
      console.log('Username is required');
      return;
    }

    const password = await question('Password (required): ');
    if (!password.trim()) {
      console.log('Password is required');
      return;
    }

    const email = await question('Email (required): ');
    if (!email.trim()) {
      console.log('Email is required');
      return;
    }

    const role = await question('Role (0=User, 1=Admin, required): ');
    if (!role.trim()) {
      console.log('Role is required');
      return;
    }

    // Create user object
    const userData = {
      fk_person: loggedInId,
      username: username.trim(),
      password: password.trim(),
      email: email.trim(),
      role: role.trim()
    };

    // run express-validator rules against our input
    const fakeReq = { body: userData };
    for (const rule of createUserValidator) {
      await rule.run(fakeReq);
    }
    const errors = validationResult(fakeReq);
    if (!errors.isEmpty()) {
      console.log('\nValidation errors:');
      errors.array().forEach(err => {
        console.log(` - ${err.param}: ${err.msg}`);
      });
      return;
    }

    // Save to database
    const user = new Users(userData);
    await user.save();

    console.log('\n User created successfully!');
    console.log('ID:', user._id);

  } catch (error) {
    console.error('Error creating user:', error.message);
  }
}
// SECTION TO CREATE USER ENDS HERE





// simple menu loop
let session = loadSession();
let loggedInId = session.loggedInId || null;

async function loginFlow() {
    console.log('\n=== Login ===\n');
    const doc = await question('Document: ');
    if (!doc.trim()) {
      console.log('Document is required');
      return;
    }
    const person = await People.findOne({ document: doc.trim()});
    if (!person) {
      console.log('No matching person found');
      return;
    }
    loggedInId = person._id.toString();
    session.loggedInId = loggedInId;
    saveSession(session);
    console.log(`\nLogged in! stored ID: ${loggedInId} (saved to session)`);
}

async function logoutFlow() {
  loggedInId = null;
  delete session.loggedInId;
  saveSession(session);
  console.log('\nLogged out!');
}





//section to create organization starts here
async function createOrganization() {
  try {
    console.log('\n=== Create New Organization ===\n');

    // Required field
    const name = await question('Organization Name (required): ');
    if (!name.trim()) {
      console.log('Organization name is required');
      return;
    }

    // Optional fields
    const short_name = await question('Short Name (optional): ');
    const country_code = await question('Country Code (optional, 2-3 letters): ');

    // Create organization object
    const orgData = {
      name: name.trim()
    };

    if (short_name.trim()) orgData.short_name = short_name.trim();
    if (country_code.trim()) orgData.country_code = country_code.trim();

    // run express-validator rules against our input
    const fakeReq = { body: orgData };
    for (const rule of createOrganizationValidator) {
      await rule.run(fakeReq);
    }
    const errors = validationResult(fakeReq);
    if (!errors.isEmpty()) {
      console.log('\nValidation errors:');
      errors.array().forEach(err => {
        console.log(` - ${err.param}: ${err.msg}`);
        return;
      });
      return;
    }

    // Save to database
    const organization = new Orgs(orgData);
    await organization.save();

    console.log('\n Organization created successfully!');
    console.log('ID:', organization._id);

  } catch (error) {
    console.error('Error creating organization:', error.message);
    return;
  }
}
//section to create organization ends here









// Main menu loop
async function mainMenu() {
    //If theyre not logged in as a person, this menu will trigger
  while (loggedInId === null) {
    console.log('\n=== CLI Main Menu ===');
    console.log('1) Create person');
    console.log('2) Login (person)');
    console.log('3) Exit');
    console.log('4) Logout');

    if (loggedInId) console.log(`(current ID: ${loggedInId})`);
    const choice = await question('Choice: ');
    switch (choice.trim()) {
        case '1':
            await createPerson();
            break;
        case '2':
            await loginFlow();
            break;
        case '3':
            rl.close();
            mongoose.connection.close();
            return;
        case '4':
            await logoutFlow();
            break;
        default:
            console.log('Invalid option');
    }
  }





  while (loggedInId !== null) {
    console.log('\n=== CLI Main Menu ===');
    console.log('1) Create user');
    console.log('2) Login (user)');
    console.log('3) Create organization');
    console.log('4) Login (organization)');
    console.log('5) Exit');
    console.log('6) Logout');

    if (loggedInId) console.log(`(current ID: ${loggedInId})`);
    const choice = await question('Choice: ');
    switch (choice.trim()) {
        case '1':
            await createUser();
            break;
        case '2':
            await inProcess();
            break;
        case '3':
            await createOrganization();
            return;
        case '4':
            await inProcess();
            break;
        case '5':
            rl.close();
            mongoose.connection.close();
            return;
        case '6':
            await logoutFlow();
            break;
        default:
            console.log('Invalid option');
    }
  }
}