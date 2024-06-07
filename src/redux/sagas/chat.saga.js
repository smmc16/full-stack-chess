import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* fetchChat(action) {
    try {
        const response = yield axios.get(`/api/chat/history/${action.payload}`);
        console.log(response);
        yield put({type: 'SET_CHAT', payload: response.data})
    } catch (error) {
        console.log('Chat get request failed', error);
    }
};

function* chatSaga() {
    yield takeLatest('FETCH_CHAT', fetchChat);
};

export default chatSaga;