An example of a NestJS application to demonstrate the use of SaferConfigModule.

Run `pnpm run start` to start the app.

You will see the error:

```
TypeError: An instance of GreetingConfig has failed the validation:
 - property NAME has failed the following constraints: NAME must be a string
```

To fix this, edit `.env` file. For example:

```properties
NAME=World
```

The app will start successfully. In another terminal run `curl http://127.0.0.1:3000/greeting ; echo` and you will see `Hello World!` response.
