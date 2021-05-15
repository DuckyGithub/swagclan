# Definitions

## Guild Command

Should at least contain the following information.

-   The ID of the guild.
-   The ID of the discord interaction that the command uses.
-   The ID and version of the command in question.

### Notes

The discord interaction ID is not networked.

## Command Indentifier

Should contain at least the following information:

-   The ID of the command.
-   The author of the command.
-   Whether the command can only be added to servers by the author.
-   A linked list of versions of the command.

## Command Version

Should contain at least the following information:

-   The version ID.

# On creating a command

Creating a command identifier, publishing a command version and adding a command to a server are 3 separate requests.
