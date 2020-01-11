import {stringify} from 'query-string';
import axios from 'axios';

/**
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'campaigns'
 * @param {Object} params The data request params, depending on the type
 * @returns {Object} { url, options } The HTTP request parameters
 */
const API_HOST = 'https://api.nasa.gov';

const convertDataProviderRequestToHTTP = (type, resource, params) => {
    let url = '';
    const options = {
        headers: new Headers({
            'Accept': 'application/ld+json',
            'Content-Type': 'application/ld+json',
        }),
    };

    switch (type) {
        case 'GET': {
            if (!params || Object.keys(params).length === 0) {
                url = `${API_HOST}/${resource}`
            } else {
                url = `${API_HOST}/${resource}?${stringify(params)}`;
            }
            break;
        }
        default:
            throw new Error(`Unsupported fetch action type ${type}`);
    }

    return {url, options};
};

/**
 * @param {Object} response HTTP response from fetch()
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The data request params, depending on the type
 * @returns {Object} Data response
 */
const convertHTTPResponseToDataProvider = (response, type, resource, params) => {
    const {data} = response;

    switch (type) {
        case 'GET': {
            return {data: data};
        }
        default:
            return {data: data};
    }
};

/**
 * @param {string} type Request type, e.g GET
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} params Request parameters. Depends on the request type
 * @returns {Promise} the Promise for response
 */
export default (type, resource, params) => {
    const {url, options} = convertDataProviderRequestToHTTP(type, resource, params);
    return axios(url, options)
        .then(response => convertHTTPResponseToDataProvider(response, type, resource, params))
        ;
};
