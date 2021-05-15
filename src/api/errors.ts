export enum ErrorCode {
    NotLoggedIn = "NOT_LOGGED_IN",
    InvalidSession = "INVALID_SESSION",

    BodyDoesNotMatchSchema = "BODY_DOES_NOT_MATCH_SCHEMA",

    CommandNotFound = "COMMAND_NOT_FOUND",
    NotCommandAuthor = "NOT_COMMAND_AUTHOR",
    CommandVersionNotFound = "COMMAND_VERSION_NOT_FOUND",
    CommandVersionUsed = "COMMAND_VERSION_USED",
    CannotOverwriteVersion = "CANNOT_OVERWRITE_VERSION",
    CannotDeleteCommandDraft = "CANNOT_DELETE_COMMAND_DRAFT",
    CannotAddCommandDraft = "CANNOT_ADD_COMMAND_DRAFT",
    DraftAlreadyInGuild = "DRAFT_ALREADY_IN_GUILD",

    TooManyCommands = "TOO_MANY_COMMANDS",
    CommandNotInGuild = "COMMAND_NOT_IN_GUILD",
    CommandAlreadyInGuild = "COMMAND_ALREADY_IN_GUILD",

    UserNotInGuild = "USER_NOT_IN_GUILD",
    BotNotInGuild = "BOT_NOT_IN_GUILD",
    CannotManageGuild = "CANNOT_MANAGE_GUILD"
}
