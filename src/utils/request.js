import {GATEWAY, API, } from '../const/config';
import axios from 'axios';

// const Tag = '[utils.request] =>';

export function mFetch(
    input,
    service = API.LOGIN,
    method = 'POST',
    headers = {
        Authorization:  'Bearer' + ' ' + localStorage.getItem('access_token'),
    }
) {
    const _uri = GATEWAY + service;
    let getOrPost;
    if (method === 'GET') {
        getOrPost = axios.get(_uri + input);
    } else {
        getOrPost = axios.post(_uri, input);
    }

    return getOrPost.then(responseJson => {
        return responseJson.data;
    }).catch(error => {
        return error;
    });
}