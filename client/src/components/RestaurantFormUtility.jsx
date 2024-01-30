import { useRef, useState, useEffect,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Form, ListGroup, Col, Row } from 'react-bootstrap';
import { PLACEHOLDER, PLACEHOLDER2 } from './Costants';
import { TimePicker } from '@hilla/react-components/TimePicker.js';
import 'react-phone-number-input/style.css'
import { StandaloneSearchBox } from '@react-google-maps/api';
import ConfirmModal from './ConfirmModal';
import dayjs from 'dayjs';
import { DAYS } from './Costants';
import API from '../API';
import {ErrorContext} from "./userContext.jsx";

// Function to calculate the size of base64-encoded data in bytes
const calculateFileSize = (dataURL) => {
    // Remove metadata prefix and convert base64 to binary
    const binaryData = atob(dataURL.split(',')[1]);

    // Calculate the length of the binary data
    return binaryData.length;
};

const handleImageChange = (event, setImage, setFileName, setViewImage) => {
    const file = event.target.files[0];
    if (file.name) {
        setFileName(file.name);
    }

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Set canvas dimensions to the image dimensions
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw image on canvas
                ctx.drawImage(img, 0, 0);

                // Determine compression quality based on image dimensions and file size
                let compressionQuality = 0.8; // Default quality
                const maxFileSizeInBytes = 50 * 1024; // 50KB

                let compressedDataURL = canvas.toDataURL('image/jpeg', compressionQuality);

                // Calculate the initial size of the compressed image in bytes
                let compressedImageSizeInBytes = calculateFileSize(compressedDataURL);

                // Check if the initial size exceeds the maximum allowed size
                while (compressedImageSizeInBytes > maxFileSizeInBytes) {
                    // Reduce compression quality and recalculate
                    compressionQuality -= 0.1;
                    compressedDataURL = canvas.toDataURL('image/jpeg', compressionQuality);
                    compressedImageSizeInBytes = calculateFileSize(compressedDataURL);
                }

                // Set the compressed image data URL in the state
                setImage(compressedDataURL);
                setViewImage(compressedDataURL);
            };
        };
        reader.readAsDataURL(file);
    }
};

const address_string_to_object = (addr) => {
    const main_infos = addr.split(';');
    const lat = parseFloat(main_infos[1].split(':')[1]);
    const lng = parseFloat(main_infos[2].split(':')[1]);
    return {
        text: main_infos[0],
        lat: lat,
        lng: lng
    };
};

const address_object_to_string = (addr) => {
    return addr.text + ';lat:' + addr.lat + ";lng:" + addr.lng;
};

/**
 * React state to use and pass to this component as props:
 * const [image, setImage] = useState(PLACEHOLDER);
 * const [fileName, setFileName] = useState('No File Chosen');
 * PLACEHOLDER is a costant declared in Costants.jsx to import 
 */
function ImageViewer(props) {
    const [viewImage,setViewImage] = useState(PLACEHOLDER2);
    const { width, height, image, setImage, fileName, setFileName } = props;
    const fileInputRef = useRef(null);
    return (
        <>
            <Container className="d-flex flex-column align-items-center">
                <img height={height} width={width} style={{ marginBottom: '5%' }} src={(image!==PLACEHOLDER) ? image : viewImage} />
                {(image === PLACEHOLDER) ? '' : <Button variant='danger' style={{ marginBottom: '5%' }} onClick={() => { setViewImage(PLACEHOLDER2); setImage(PLACEHOLDER); setFileName('No File Chosen'); }}>Remove Current Image</Button>}

            </Container>
            <Container className="d-flex align-items-center custom-input">
                <Button variant='secondary' onClick={() => { fileInputRef.current.click() }}>Choose File</Button><span style={{ marginLeft: '5%' }}>{fileName}</span>
                <Form.Control style={{ display: 'none' }} type='file' ref={fileInputRef} onChange={(event) => handleImageChange(event, setImage, setFileName, setViewImage)} accept="image/*" />
            </Container>
        </>
    );
}

function DishItem(props) {
    const { dish, deleteDish,setManageDish } = props;
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    return (
        //border-0 to remove the border
        <ListGroup.Item className="border-0">
            <Row>
                <Col xs={8}>{dish.name}</Col>
                <Col xs={2}>
                    <Button size='sm' variant="success" onClick={() => { setManageDish({route: 'add_dish', id: dish.id}) }}>
                        <i className="bi bi-pencil-square"></i>
                    </Button>
                </Col>
                <Col xs={2}>
                    <Button size='sm' variant="danger" onClick={() => { setShow(true); }}>
                        <i className="bi bi-trash"></i>
                    </Button>
                </Col>
                <ConfirmModal text={'Delete the Dish'} show={show} setShow={setShow} action={deleteDish} parameter={dish.id} />
            </Row>
        </ListGroup.Item>
    );
}

/**
 * React state to use and pass to this component as props:
 * const [address, setAddress] = useState({ text: '', lat: 0.0, lng: 0.0, invalid: false });
 */
function AddressSelector(props) {
    const handleError = useContext(ErrorContext);
    const { address, setAddress, isInProfilePage } = props;
    const inputRef = useRef();

    const handlePlaceChanged = async () => {
        const [place] = inputRef.current.getPlaces();
        if (place) {
            setAddress({
                text: place.formatted_address,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                invalid: address.invalid
            });
            if(isInProfilePage == true){
                const location = place.formatted_address + ';lat:' + place.geometry.location.lat() + ";lng:" + place.geometry.location.lng();
                const updatedUser = { 
                    position: location, 
                    isRestaurateur: 1, 
                    username: "Restaurateur"
                };
                //console.log(updatedUser);
    
                // Now call the updateUser API with the updated user information
                try {
                    const result = await API.updateUser(updatedUser); // Assuming updateUser returns a promise
                    //console.log("User updated successfully:", result);
                    // You might want to do something with the result or updated user here
                } catch(error) {
                    handleError({error: `Failed to update user:${error.error}`});
                    // Handle the error appropriately
                }
            }
        }
    };
    

    return (
        <StandaloneSearchBox onLoad={(ref) => (inputRef.current = ref)} onPlacesChanged={handlePlaceChanged}>
            <>
                <Form.Control
                    isInvalid={address.invalid}
                    type="text"
                    placeholder=""
                    // HERE NOT TO AVOID CALL TOO MUCH THE API onChange={(event) => addressValidation({text: event.target.value, lat:address.lat, lng:address.lng, invalid: address.invalid},setAddress)}
                    onChange={(event) => { setAddress({ text: event.target.value.trim(), lat: address.lat, lng: address.lng, invalid: address.invalid }); }}
                    defaultValue={address.text}
                />
                <Form.Control.Feedback type="invalid">Please Insert a Valid Address</Form.Control.Feedback>
            </>
        </StandaloneSearchBox>
    );
}

const time_string_to_object = (time) => {
    const days = time.split('/');

    const times = days.map((day) => {
        const day_name_hours = day.split('=');
        const day_name = day_name_hours[0];
        const intervals = day_name_hours[1].split(';').map((interval) => {
            return {
                first: interval.split('-')[0],
                last: interval.split('-')[1]
            };
        });
        return intervals.map((interval) => {
            return {
                day: day_name,
                first: interval.first,
                last: interval.last
            }
        })
    });

    return times.flat().map((time, index) => {
        return {
            id: index,
            day: time.day,
            first: time.first,
            last: time.last,
            invalid: false
        }
    });
};

const time_object_to_string = (times) => {
    const result = {};

    // Group the array by day
    times.forEach(({ day, first, last }) => {
        if (!result[day]) {
            result[day] = [];
        }
        result[day].push(`${first}-${last}`);
    });

    // Format the grouped data into the desired string format
    const formattedString = Object.keys(result)
        .map((day) => `${day}=${result[day].join(';')}`)
        .join('/');

    return formattedString;
};

const filter_by_day = (times, day) => {
    return times
        .map((time) => ({ day: time.day, first: time.first, last: time.last, id: time.id, invalid: time.invalid }))
        .filter((time) => (time.day === day ? true : false));
};

function sort_and_merge_times(times) {
    let sortedIntervals = times.sort((a, b) => {
      // Sort by day
      const dayComparison = DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
  
      // If the days are different, return the day comparison result
      if (dayComparison !== 0) {
        return dayComparison;
      }
  
      // If the days are the same, sort by the 'first' field using dayjs
      const first_hour_a = dayjs(`2023-01-01T${a.first}`);
      const first_hour_b = dayjs(`2023-01-01T${b.first}`);
      const firstComparison = first_hour_a.isBefore(first_hour_b);
  
      return (firstComparison === true) ? -1 : 1;
    });
    
    // Merge Open 24 Hours
    const open_24_intervals = [];
    for (const interval of sortedIntervals) {
        // if open 24 hours, add the day
        if(interval.first === "00:00" && interval.last === "00:00") {
            // add only 1 time
            if (open_24_intervals.filter((open_24_interval) => open_24_interval == interval).length === 0) {
                open_24_intervals.push(interval);
            }
        }
    }

    // loop over the open 24 hours day, remove all the intervals and add only one of 00:00-00:00
    for (const open_24_interval of open_24_intervals) {
        sortedIntervals = sortedIntervals.filter((interval) => interval.day !== open_24_interval.day);
        sortedIntervals.push({...open_24_interval,first: "00:00",last: "00:00"});
    }
    
    // Merge overlapping intervals
    const mergedIntervals = [];
    let currentInterval = sortedIntervals[0];
  
    for (let i = 1; i < sortedIntervals.length; i++) {
      const nextInterval = sortedIntervals[i];
  
      if (nextInterval.day === currentInterval.day) {
        const currentEnd = dayjs(`2023-01-01 ${currentInterval.last}`);
        const nextStart = dayjs(`2023-01-01 ${nextInterval.first}`);
        const nextEnd = dayjs(`2023-01-01 ${nextInterval.last}`);
  
        if (nextStart.isBefore(currentEnd) || nextStart.isSame(currentEnd)) {
          // Merge overlapping intervals and update the last time
          currentInterval.last = nextEnd.isAfter(currentEnd) ? nextInterval.last : currentInterval.last;
        } else {
          // Add currentInterval to the result and update currentInterval
          mergedIntervals.push({ ...currentInterval });
          currentInterval = nextInterval;
        }
      } else {
        // Add currentInterval to the result and update currentInterval
        mergedIntervals.push({ ...currentInterval });
        currentInterval = nextInterval;
      }
    }
  
    // Add the last interval
    mergedIntervals.push({ ...currentInterval });
    return mergedIntervals;
  }

function EditTimeSelector(props) {
    const { n_times, time, addTime, setTimeArrays, saveTime, deleteTime, checkTime } = props;

    return (
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <TimePicker invalid={time.invalid} style={{ width: "30%", marginRight: "2%" }} value={time.first} step={60 * 30} onChange={(event) => {
                const new_time = { day: time.day, id: time.id, first: event.target.value, last: time.last, invalid: time.invalid };
                // check only if also last is inserted, otherwise error while user is inserting
                // save to save first even if last is not present
                saveTime(new_time, setTimeArrays);
                if (new_time.last) {
                    checkTime(new_time, setTimeArrays);
                }
            }} onKeyDown={(event) => { event.preventDefault() }} />
            <TimePicker invalid={time.invalid} style={{ width: "30%", marginRight: "5%" }} value={time.last} step={60 * 30} onChange={(event) => {
                const new_time = { day: time.day, id: time.id, first: time.first, last: event.target.value, invalid: time.invalid };
                // check only if also first is inserted, otherwise error while user is inserting
                // save to save last even if first is not present
                saveTime(new_time, setTimeArrays);
                if (new_time.first) {
                    checkTime(new_time, setTimeArrays);
                }
            }} onKeyDown={(event) => { event.preventDefault() }} />
            { (time.first === '00:00' && time.last === '00:00') ? '' : <Button size='sm' variant="success" onClick={() => { addTime(setTimeArrays,time.day) }} style={{ marginRight: "2%" }}><i className="bi bi-plus-lg"></i></Button>}
            {(n_times > 1) ? <Button size='sm' variant="danger" onClick={() => { deleteTime(time.id, setTimeArrays) }}><i className="bi bi-trash"></i></Button> : ''}
            <p style={{ display: 'block', color: '#dc3545' }} className='small'>{(time.invalid === true) ? 'Choose a valid time interval' : ''}</p>
        </div>
    );
}

function ViewTimeSelector(props) {
    const { n_times, time, setTimeArrays, saveTime, deleteTime, checkTime } = props;

    return (
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <TimePicker invalid={time.invalid} style={{ width: "30%", marginRight: "2%" }} value={time.first} step={60 * 30} onChange={(event) => {
                const new_time = { day: time.day, id: time.id, first: event.target.value, last: time.last, invalid: time.invalid };
                //saveTime(new_time, setTimeArrays);
                checkTime(new_time, setTimeArrays);
            }} onKeyDown={(event) => { event.preventDefault() }} />
            <TimePicker invalid={time.invalid} style={{ width: "30%", marginRight: "5%" }} value={time.last} step={60 * 30} onChange={(event) => {
                const new_time = { day: time.day, id: time.id, first: time.first, last: event.target.value, invalid: time.invalid };
                //saveTime(new_time, setTimeArrays);
                checkTime(new_time, setTimeArrays);
            }} onKeyDown={(event) => { event.preventDefault() }} />
            <Button size='sm' variant="danger" onClick={() => { deleteTime(time.id, setTimeArrays) }}><i className="bi bi-trash"></i></Button>
            <p style={{ display: 'block', color: '#dc3545' }} className='small'>{(time.invalid === true) ? 'Choose a valid time interval' : ''}</p>
        </div>
    );
}

function ViewDailyTimeSelector(props) {
    const { n_times, times, deleteTime, setTimeArrays, saveTime, checkTime } = props;
    const day = times[0].day;

    return (
        <>
            <div style={{ marginBottom: '10px' }}>
                <strong>{day}:</strong>
            </div>
            {times.map((time) => {
                return <ViewTimeSelector key={time.id} n_times={n_times} time={time} deleteTime={deleteTime} setTimeArrays={setTimeArrays} saveTime={saveTime} checkTime={checkTime}/>;
            })}
        </>
    );
}

export { ImageViewer, DishItem, EditTimeSelector, ViewTimeSelector, ViewDailyTimeSelector, AddressSelector, address_string_to_object, address_object_to_string, time_string_to_object, time_object_to_string, filter_by_day, sort_and_merge_times };
