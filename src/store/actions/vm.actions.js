// import axios from 'axios';
// import {  SUCCESS_CODE } from 'const/config';
import axiosClient from "api/axiosClient";
import { API } from 'const';
export const GET_DATA = '[DATA APP] GET DATA';
export const ERRORS = '[DATA APP] GET ERRORS';


export function getListUser(page, filter)
{
    const request =  axiosClient.get(API.USER_MANAGER); 
    return (dispatch) => {
        request.then((response) => {
            if(response.data.errorCode) {
                dispatch({
                    type   : GET_DATA,
                    payload: response.data,
                    page: page
                })
            } else {
                dispatch({
                    type   : ERRORS,
                    payload: response.data
                })
            }
        });
    }
}

// export function setMessage(type, message)
// {
//     return async (dispatch)  => {
//         return dispatch({
//             type: GET_MESSAGE,
//             payload: {
//                 type: type,
//                 data: message
//             }
//         })
//     };
// }
