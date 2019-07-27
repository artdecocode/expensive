## Configuration

Upon the first run the program will ask a series of questions:

```fs
Username: <namecheap-username>
Api key https://ap.www.namecheap.com/settings/tools/apiaccess/: <api key>
Client ip [10.10.10.10]: <the ip>
Last 3 digit of phone to use for 2 factor auth: <055>
```

After they've been answered, `expensive` will remember the answers and store them in the `.expensiverc` file in the home directory (or `.expensive-sandboxrc`), and use this data for all calls to the API.

Client IP is required for requests, but if not given, it will be acquired automatically each time prior to calls.

The last 3 digits will be used to during the second-stage of the 2-factor web auth required to white-list unknown IP addresses.

%~%

## Sandbox

To use the `sandbox` version of the app for testing, either the `SANDBOX` environmental variable needs to be set, or `--sandbox` or `-s` flags should be passed.

%~%