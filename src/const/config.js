export const labbackup = 'https://api-backup.fptvds.vn';
// export const labbackup = 'http://192.168.29.43:5000';
export const SUCCESS_CODE = 200;
export const ERROR_TOKEN = 401;
export const API = {
  LOGIN: `${labbackup}/api/v1/benji/login`,
  REFRESH_TOKEN: `${labbackup}/api/v1/benji/refresh`,
  USER_STARTIC: `${labbackup}/api/v1/benji/user/statistic`,

  LIST_BACKUP: `${labbackup}/api/v1/benji/versions`,
  DELETE_BACKUP: `${labbackup}/api/v1/benji/version`,
  RESTORE_BACKUP: `${labbackup}/api/v1/benji/version`,
  CREATE_BACKUP: `${labbackup}/api/v1/benji/versions`,
  CREATE_ALL_BACKUP: `${labbackup}/api/v1/benji/vm/backups`,

  LIST_POLICY: `${labbackup}/api/v1/benji/schedule/jobs`,
  CREATE_POLICY: `${labbackup}/api/v1/benji/schedule/jobs`,
  DELETE_POLICY: `${labbackup}/api/v1/benji/schedule/job`,
  UPDATE_POLICY: `${labbackup}/api/v1/benji/schedule/job`,

  LIST_STORAGES: `${labbackup}/api/v1/benji/storages`,
  CREATE_STORAGES: `${labbackup}/api/v1/benji/storages`,
  UPDATE_STORAGES: `${labbackup}/api/v1/benji/storage`,
  DELETE_STORAGES: `${labbackup}/api/v1/benji/storage`,

  LIST_NODE: `${labbackup}/api/v1/benji/nodes`,
  USER_MANAGER: `${labbackup}/api/v1/benji/users/statistic`,
  LIST_USER: `${labbackup}/api/v1/benji/users`,

  LIST_GROUP_BACKUP: `${labbackup}/api/v1/benji/volume-groups`,
  CREATE_GROUP_BACKUP: `${labbackup}/api/v1/benji/volume-groups`,
  UPDATE_GROUP_BACKUP: `${labbackup}/api/v1/benji/volume-group`,
  GET_GROUP_ID: `${labbackup}/api/v1/benji/volume-group`,
  DELETE_GROUP_BACKUP: `${labbackup}/api/v1/benji/volume-group`,

  LIST_VM: `${labbackup}/api/v1/benji/vms`,
  LIST_VOLUMES: `${labbackup}/api/v1/benji/vm/id/volumes`,
  LIST_VMS_VOLUMES: `${labbackup}/api/v1/benji/vm`,
};
export const MODE = {
  CREATE: "create",
  UPDATE: "update",
};

export const setConditions = (params) => {
  let condition = "";
  Object.keys(params).forEach((element) => {
    if (params[element])
      // condition += String(${element}__eq__${params[element]},);
      condition += String(`${element}=${params[element]}&`);
  });
  condition = condition.slice(0, -1);
  return condition;
};

export const setSearchPolicy = (params) => {
  let condition = "";
  Object.keys(params).forEach((element) => {
    if (params[element])
      // condition += String(${element}__eq__${params[element]},);
      condition += String(`${element}=${params[element]}&`);
  });
  condition = condition.slice(0, -1);
  return condition;
};

export const setSearchUser = (params) => {
  let condition = "";
  Object.keys(params).forEach((element) => {
    if (params[element])
      // condition += String(${element}__eq__${params[element]},);
      condition += String(`${element}=${params[element]}&`);
  });
  condition = condition.slice(0, -1);
  return condition;
};

export const setSearchGroup = (params) => {
  let condition = "";
  Object.keys(params).forEach((element) => {
    if (params[element])
      // condition += String(${element}__eq__${params[element]},);
      condition += String(`${element}=${params[element]}&`);
  });
  condition = condition.slice(0, -1);
  return condition;
};

export const getDayevery = (days_of_week) => {
  switch (days_of_week) {
    case "mon,tue,wed,thu,fri,sat,sun":
      return "Everyday";
    default:
      return days_of_week.split("-");
  }
};

export const getDeleted = (deleted) => {
  switch (deleted) {
    case "true":
      return "Deleted";
    default:
      return "Deleted";
  }
};

export const Pattern = {
  // Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
  // PASSWORD: /(?=^.{8,}$)(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  PASSWORD: /(?=^.{8,}$)(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  // Minimum 10 characters
  PHONE_NUM: /[0-9]{10,}/,
  //only lowercase and uppercase letters
  FULL_NAME: /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF ]+$/,
  //get email address from url
  GET_EMAIL:
    /([a-zA-Z0-9._-]+@([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+)(?=\?secret)(.*?)/g,
  //start with a word only
  USERNAME: /^[a-zA-Z]+[a-zA-Z0-9\-_.]*$/g,
  //only 6 numbers
  OTP: /^[0-9]{6}$/g,
};

const token_type = "Bearer";
export const headers = {
  Authorization: token_type + " " + localStorage.getItem("access_token"),
};
