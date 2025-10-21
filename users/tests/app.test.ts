import { UserList } from "../src/UserList";

let users = new UserList();

test('Missing Fields', () => {
    const noEmail = {'username': 'Joe' ,'password': 'abcd'}
    const noPassword = {'email': 'email@email.com', 'username': 'Joe'}
    const noUsername = {'email': 'email@email.com', 'password': 'abcd'}
    expect(() => users.registerUser(noEmail));
    expect(() => users.registerUser(noPassword));
    expect(() => users.registerUser(noUsername));
});