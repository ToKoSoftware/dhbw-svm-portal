export enum PortalErrors {
  // eslint-disable-next-line
  PERMISSION_DENIED = <any>'Permission denied!',
  // eslint-disable-next-line
  INTERNAL_SERVER_ERROR = <any>'Internal server error!',
  // eslint-disable-next-line
  UNAUTHORIZED = <any>'Unauthorized!',
  //eslint-disable-next-line
  FILESERVER_ERROR = <any>'Fileserver error',
  //eslint-disable-next-line
  BAD_REQUEST = <any>'Bad Request',
  //eslint-disable-next-line
  NOT_FOUND = <any>'Not Found',
  //eslint-disable-next-line
  FORBIDDEN = <any>'Forbidden',
  //eslint-disable-next-line
  NOT_ALL_REQUIRED_FIELDS_HAVE_BEEN_SET = <any>'Not all required fields have been set',
  //eslint-disable-next-line
  DATABASE_ERROR = <any>'Database error',
  //eslint-disable-next-line
  THERE_IS_NO_ROLE_IN_YOUR_ORGANIZATION_WITH_GIVEN_MAINTAIN_ROLE_ID = <any>'There is no role in your organization with given maintain_role_id',
  //eslint-disable-next-line
  COULD_NOT_CREATE_TEAM = <any>'Could not create Team',
  //eslint-disable-next-line
  COULD_NOT_DELETE_TEAM_WITH_ID = <any>'Could not delete team with id ',
  //eslint-disable-next-line
  COULD_NOT_DELETE_MEMBERSHIP_WITH_ID = <any>'Could not delete membership with id ',
  //eslint-disable-next-line
  NO_POLL_WITH_GIVEN_ID = <any>'No poll with given id',
  //eslint-disable-next-line
  COULD_NOT_DELETE_POLLS_BELONGING_TO_TEAM_WITH_ID = <any>'Could not delete polls belonging to team with id ',
  //eslint-disable-next-line
  COULD_NOT_DELETE_POLLANSWERS_BELONGING_TO_TEAM_WITH_ID = <any>'Could not delete pollanswers belonging to team with id ',
  //eslint-disable-next-line
  FIELDS_MUST_NOT_BE_EMPTY = <any>'Fields must not be empty',
  //eslint-disable-next-line
  UNAUTHORIZED_YOU_ARE_NOT_MAINTAINER_OF_THIS_TEAM_AND_NOT_ADMIN = <any>'Unauthorized! You are not maintainer of this team and not admin!',
  //eslint-disable-next-line
  NO_TEAM_WITH_GIVEN_ID_FOUND = <any>'No Team with given id found',
  //eslint-disable-next-line
  NO_MEMBERSHIP_WITH_GIVEN_DATA = <any>'No membership with given data',
  //eslint-disable-next-line
  INVALID_INPUT_DATA = <any>'Invalid input data!',
  //eslint-disable-next-line
  NO_ROLE_WITH_GIVEN_ID_FOUND = <any>'No Role with given id found',
  //eslint-disable-next-line
  NO_ROLE_WITH_GIVEN_ID = <any>'No Role with given id',
  //eslint-disable-next-line
  COULD_NOT_DELETE_ROLE_WITH_ID = <any>'Could not delete role with id ',
  //eslint-disable-next-line
  COULD_NOT_CREATE_ROLE = <any>'Could not create Role',
  //eslint-disable-next-line
  YOU_ARE_NOT_ALLOWED_TO_UPDATE_TO_A_POLL_FOR_A_TEAM_YOU_ARE_NOT_MAINTAINER_OF = <any>'You are not allowed to update a Poll for a team you are not maintainer of.',
  //eslint-disable-next-line
  NO_POLL_WITH_GIVEN_ID_FOUND = <any>'No Poll with given id found',
  //eslint-disable-next-line
  COULD_NOT_DELETE_POLL_WITH_ID = <any>'Could not delete poll with id ',
  //eslint-disable-next-line
  YOU_ARE_NOT_ALLOWED_TO_DELETE_A_POLL_FOR_A_TEAM_YOU_ARE_NOT_MAINTAINER_OF = <any>'You are not allowed to delete a Poll for a team you are not maintainer of.',
  //eslint-disable-next-line
  COULD_NOT_CREATE_POLL = <any>'Could not create Poll',
  //eslint-disable-next-line
  YOU_ARE_NOT_ALLOWED_TO_CREATE_A_POLL_FOR_A_TEAM_YOU_ARE_NOT_MAINTAINER_OF = <any>'You are not allowed to create a Poll for a team you are not maintainer of.',
  //eslint-disable-next-line
  THERE_IS_NO_TEAM_IN_YOUR_ORGANIZATION_WITH_GIVEN_ANSWER_TEAM_ID = <any>'There is no team in your organization with given answer_team_id',
  //eslint-disable-next-line
  COULD_NOT_DELETE_POLLVOTES_BELONGING_TO_POLL_WITH_ID = <any>'Could not delete PollVotes belonging to poll with id ',
  //eslint-disable-next-line
  CLOSES_AT_IS_NOT_VALID = <any>'Closes_at is not valid',
  //eslint-disable-next-line
  NO_POLLVOTE_WITH_GIVEN_ID_FOUND = <any>'No PollVote with given id found',
  //eslint-disable-next-line
  THERE_IS_NO_ACTIVE_POLLANSWER_WITH_THE_GIVEN_ID = <any>'There is no active PollAnswer with the given id!',
  //eslint-disable-next-line
  NO_POLLVOTE_BELONGING_TO_THE_GIVEN_POLLID_WITH_YOUR_USER_DATA_FOUND = <any>'No PollVote belonging to the given PollId with your user data found!',
  //eslint-disable-next-line
  COULD_NOT_CREATE_POLLVOTE = <any>'Could not create PollVote',
  //eslint-disable-next-line
  YOU_ALREADY_VOTED = <any>'You already voted!',
  //eslint-disable-next-line
  YOU_ARE_NOT_ALLOWED_TO_CREATE_A_POLLANSWER_FOR_A_TEAM_YOU_ARE_NOT_MAINTAINER_OF = <any>'You are not allowed to create a PollAnswers for a team you are not maintainer of.',
  //eslint-disable-next-line
  NO_POLLANSWER_WITH_GIVEN_ID_FOUND = <any>'No PollAnswer with given id found',
  //eslint-disable-next-line
  COULD_NOT_DELETE_POLLANSWER_WITH_ID = <any>'Could not delete pollanswer with id ',
  //eslint-disable-next-line
  YOU_ARE_NOT_ALLOWED_TO_DELETE_A_POLLANSWER_FOR_A_TEAM_YOU_ARE_NOT_MAINTAINER_OF = <any>'You are not allowed to delete a PollAnswers for a team you are not maintainer of.',
  //eslint-disable-next-line
  COULD_NOT_CREATE_POLLANSWER = <any>'Could not create PollAnswer',
  //eslint-disable-next-line
}