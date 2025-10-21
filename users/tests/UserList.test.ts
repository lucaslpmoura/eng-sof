import { UserList } from "../src/UserList";

let testUserList = new UserList();

test('[UserList] - Invalid inputs', () => {
    const noEmailUser = {'password': '123456', 'username': 'Lucas'};
    const noUsernameUser = {'email': 'lucas@email.com', 'password': 'AStrongPassword'};
    const noPasswordUser = {'email': 'email@email.com', 'username': 'Lucas'};

    const badEmailUser = {'email': 'lucas.com', 'username': 'Lucas', 'password': 'AStrongPassword'};
    const badUsernameUser = {'email': 'lucas@emailcom', 'username': 'Lucas-123;.', 'password': 'AStrongPassword'};

    const goodUser = {'email': 'lucas@email.com', 'username': 'Lucas', 'password': 'AStrongPassword'};

    expect(() => testUserList.registerUser(noEmailUser)).toThrow('User email is invalid');
    expect(() => testUserList.registerUser(noUsernameUser)).toThrow('Invalid username.');
    expect(() => testUserList.registerUser(noPasswordUser)).toThrow('User password is invalid.');

    expect(() => testUserList.registerUser(badEmailUser)).toThrow('User email is invalid');
    expect(() => testUserList.registerUser(badUsernameUser)).toThrow('Invalid username.');
});

test('[UserList] - List Validation', () => {
    const goodUser = {'email': 'lucas@email.com', 'username': 'Lucas', 'password': 'AStrongPassword'};

    expect(() => testUserList.registerUser(goodUser)).not.toThrow();
    expect(() => testUserList.registerUser(goodUser)).toThrow('User with this email is already Registered.');

});

