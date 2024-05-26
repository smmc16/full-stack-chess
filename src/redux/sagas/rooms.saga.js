import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* fetchRooms() {
    try {
        const response = yield axios.get('/api/game/rooms');
        console.log(response);
        yield put({type: 'SET_ROOMS', payload: response.data})
    } catch (error) {
        console.log('Room get request failed', error);
    }
};

function* roomSaga() {
    yield takeLatest('FETCH_ROOMS', fetchRooms);
};

export default roomSaga;

