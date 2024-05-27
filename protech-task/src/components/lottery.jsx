// src/components/Lottery.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import mooncake from '../img/mooncake.jpg';
import voucher from '../img/voucher.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faAddressCard, faThumbsUp, faTrophy, faMessage, faShareFromSquare, faShare } from '@fortawesome/free-solid-svg-icons';
import '../App.css';

const Lottery = () => {

    const [drawChances, setDrawChances] = useState(localStorage.getItem('drawChance') ? localStorage.getItem('drawChance') : 7);
    const [wordsLeft, setWords] = useState(localStorage.getItem('wordsLeft') ? localStorage.getItem('wordsLeft') : 10);
    const [currentDate, setCurrentDate] = useState(localStorage.getItem('date') ? localStorage.getItem('date') : new Date().toDateString());
    const [chars, setChars] = useState(localStorage.getItem('chars') ? JSON.parse(localStorage.getItem('chars')) : []);
    const [prize, setPrize] = useState(false);
    const [modal, setModal] = useState(false);
    const [modalBig, setModalBig] = useState(false);
    const [drawWords, setDrawWords] = useState("");
    const julyFirst2024 = new Date('July 1, 2024');

    // localStorage.removeItem('date');
    // localStorage.setItem('chars', JSON.stringify(chars));
    // localStorage.removeItem('chars');
    // localStorage.removeItem('wordsLeft');
    useEffect(() => {

        const charsLocal = localStorage.getItem('chars');

        const hasNonZeroQuantity = Object.values(chars).some(char => char.quantity !== 0);

        if (!charsLocal) {
            axios.get('http://localhost:3001/items')
                .then(response => {
                    // Assuming response.data is an array of objects with id and quantity properties
                    setChars(response.data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }, []);
    useEffect(() => {
        // // localStorage.setItem('drawChance', 7);
        const storedDate = localStorage.getItem('date');
        const storedChance = localStorage.getItem('drawChance');


        if (storedDate !== currentDate) {
            localStorage.setItem('date', currentDate);
            if (storedChance) {
                setDrawChances(9);
                localStorage.setItem('drawChance', 9);
            }
        } else {

            if (storedChance) {
                setDrawChances(parseInt(storedChance, 10));
            }
        }
    }, [currentDate]);

    useEffect(() => {
        const hasNonZeroQuantity = Object.values(chars).some(char => char.quantity !== 0);
        const countZeroQuantityChars = chars.filter(char => char.quantity === 0).length;

        if (hasNonZeroQuantity) {
            localStorage.setItem('chars', JSON.stringify(chars));
            localStorage.setItem('drawChance', drawChances);
            localStorage.setItem('wordsLeft', countZeroQuantityChars);
            // const storedChars = localStorage.getItem('chars');
            // if (storedChars) {
            //     setChars(JSON.parse(storedChars));
            // }
            setWords(countZeroQuantityChars);
            setDrawChances(drawChances);
        }

        // const chances = localStorage.getItem('drawChance');
        if (chars.every(char => char.quantity > 0)) {
            setPrize(true);
        } else {
            setPrize(false);
        }


    }, [chars]);


    // 抽字function
    const drawCharacter = () => {
        const randomIndex = Math.floor(Math.random() * chars.length);
        const randomCharacterId = chars[randomIndex].id;

        setChars(chars.map(char => {
            if (char.id === randomCharacterId) {
                return { ...char, quantity: char.quantity + 1 };
            }
            return char;
        }));

        setDrawChances(drawChances - 1);
        setModal(true);
        setDrawWords(randomCharacterId);
    };

    // 重置 function
    const reset = () => {
        localStorage.setItem('date', new Date().toDateString());
        setCurrentDate(new Date().toDateString());
        localStorage.setItem('chars', JSON.stringify([
            { id: '和', quantity: 0 },
            { id: '美', quantity: 0 },
            { id: '中', quantity: 0 },
            { id: '秋', quantity: 0 },
            { id: '节', quantity: 0 },
            { id: '团', quantity: 0 },
            { id: '圆', quantity: 0 },
            { id: '共', quantity: 0 },
            { id: '此', quantity: 0 },
            { id: '时', quantity: 0 }
        ]));
        setChars([
            { id: '和', quantity: 0 },
            { id: '美', quantity: 0 },
            { id: '中', quantity: 0 },
            { id: '秋', quantity: 0 },
            { id: '节', quantity: 0 },
            { id: '团', quantity: 0 },
            { id: '圆', quantity: 0 },
            { id: '共', quantity: 0 },
            { id: '此', quantity: 0 },
            { id: '时', quantity: 0 }
        ]);
        // localStorage.setItem('chars', JSON.stringify([
        //     { id: '和', quantity: 0 },
        //     { id: '美', quantity: 0 },
        //     { id: '中', quantity: 0 },
        //     { id: '秋', quantity: 0 },
        //     { id: '节', quantity: 0 },
        //     { id: '团', quantity: 0 },
        //     { id: '圆', quantity: 0 },
        //     { id: '共', quantity: 0 },
        //     { id: '此', quantity: 0 },
        //     { id: '时', quantity: 0 }
        // ]));
        // setChars([
        //     { id: '和', quantity: 0 },
        //     { id: '美', quantity: 0 },
        //     { id: '中', quantity: 0 },
        //     { id: '秋', quantity: 0 },
        //     { id: '节', quantity: 0 },
        //     { id: '团', quantity: 0 },
        //     { id: '圆', quantity: 0 },
        //     { id: '共', quantity: 0 },
        //     { id: '此', quantity: 0 },
        //     { id: '时', quantity: 0 }
        // ]);
        setWords(10);
        localStorage.removeItem('wordsLeft');
        setDrawChances(7);
        localStorage.removeItem('drawChance');
    }

    // 另外一天 function
    const incrementDate = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 1);
        setCurrentDate(newDate.toDateString());
    };

    // 抽大奖function
    const drawBigPrize = () => {
        if (chars.every(char => char.quantity > 0)) {
            setChars(chars.map(char => ({ ...char, quantity: char.quantity - 1 })));
        }
        setModalBig(true);
    };

    // 关闭modal
    const hideModal = () => {
        setModal(false);
        setModalBig(false);
    };

    // CSS style
    const style = {
        iconColor: {
            color: '#6495ED'
        },
        wordStyle: {
            fontSize: '20px',
            borderRadius: '5px'
        },
        badgeStyle: {
            backgroundColor: '#EDD6B6',
            color: '#EE4B2B',
            transform: 'translate(-105%, 5%)',
            fontSize: '10px',
            left: '100%',
        },
        drawButton: {
            borderRadius: '30px',
            backgroundColor: '#EE4B2B',
            color: '#EDD6B6',
            display: 'block',
            cursor: 'pointer',
            opacity: (drawChances == 0 || new Date(currentDate) > julyFirst2024 ? 0.5 : 1),
        },
        prizeButton: {
            borderRadius: '30px',
            backgroundColor: '#EE4B2B',
            color: '#EDD6B6',
            display: 'block',
            cursor: 'pointer',
            opacity: (prize == false ? 0.5 : 1),
        }
    }



    return (
        <div className="row justify-content-center">
            <div className="row mx-0 justify-content-between my-3">
                <div className="col-6 text-end"><button className='btn btn-danger' onClick={reset}>重置</button></div>
                <div className="col-6 text-start"><button className='btn btn-primary' onClick={incrementDate}>另一天</button></div>
            </div>
            <div className='mb-2'>{currentDate}</div>
            <div className="col-lg-4 col-md-8 col-12 px-0" style={{ border: '1px solid grey', borderBottom: '0' }}>
                <div className="row mx-0">
                    <img className='px-0' src={mooncake} alt="" />
                </div>
                <div className="row ps-2 mx-0 py-3" style={{ borderBottom: '1px solid #ededed' }}>
                    <div className="col-11 text-start mb-2" style={{ fontWeight: 'bold' }}>喜迎中秋在线集字活动</div>
                    <div className="col-1 text-start mb-2"><FontAwesomeIcon icon={faShare} /></div>
                    <div className="col-12 text-start"><small className='text-muted'>活动创建时间: 2024-05-26 17:55:01</small></div>
                    <div className="col-12 text-start">活动开始时间: 2024-05-27 00:00:00</div>
                    <div className="col-12 text-start">活动结束时间: 2024-06-30 23:59:59</div>
                    <div className="col-12 text-start">活动时间总数: 30天</div>
                </div>

                <div className="row mx-0 py-2" style={{ borderBottom: '1px solid #ededed' }}>
                    <div className="col-3 py-3">
                        <div className="row mx-0">
                            <div className="col-12 mb-1">
                                <FontAwesomeIcon icon={faGear} size='lg' style={style.iconColor} />
                            </div>
                            <div className="col-12">活动管理</div>
                        </div>
                    </div>
                    <div className="col-3 py-3">
                        <div className="row mx-0">
                            <div className="col-12 mb-1">
                                <FontAwesomeIcon icon={faAddressCard} size='lg' style={style.iconColor} />
                            </div>
                            <div className="col-12">报名信息</div>
                        </div>

                    </div>
                    <div className="col-3 py-3">
                        <div className="row mx-0">
                            <div className="col-12 mb-1">
                                <FontAwesomeIcon icon={faThumbsUp} size='lg' style={style.iconColor} />
                            </div>
                            <div className="col-12">邀请助力</div>
                        </div>

                    </div>
                    <div className="col-3 py-3">
                        <div className="row mx-0">
                            <div className="col-12 mb-1">
                                <FontAwesomeIcon icon={faTrophy} size='lg' style={style.iconColor} />
                            </div>
                            <div className="col-12">排行榜</div>
                        </div>
                    </div>
                    <div className="col-3 py-3">
                        <div className="row mx-0">
                            <div className="col-12 mb-1">
                                <FontAwesomeIcon icon={faMessage} size='lg' style={style.iconColor} />
                            </div>
                            <div className="col-12">活动说明</div>
                        </div>
                    </div>
                    <div className="col-3 py-3">
                        <div className="row mx-0">
                            <div className="col-12 mb-1">
                                <FontAwesomeIcon icon={faShareFromSquare} size='lg' style={style.iconColor} />
                            </div>
                            <div className="col-12">分享</div>
                        </div>
                    </div>
                </div>
                <div className="row mx-0 py-3 text-muted">
                    <div className="col-12 text-muted">
                        {prize == false ? '加油！还差 ' + wordsLeft + ' 个字即可合成' : '可以抽大奖咯'}
                    </div>
                </div>
                <div className="container mb-5 pe-0 pe-md-3">
                    <div className="row row-cols-5 mx-0">
                        {chars.map((char) => (
                            <div className="col mb-4 px-2 px-md-3" key={char.id}>
                                <div className="p-3 position-relative" style={{
                                    ...style.wordStyle,
                                    backgroundColor: char.quantity === 0 ? '#B0B0B0' : '#EE4B2B',
                                    color: char.quantity === 0 ? '#787878' : '#EDD6B6',
                                }}>
                                    {char.id}
                                    {char.quantity != 0 &&
                                        <span className="position-absolute top-0 start-100 badge rounded-pill" style={style.badgeStyle}>
                                            {char.quantity}
                                        </span>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="row mx-0 mt-2 justify-content-center">
                        <div className="col-6">
                            <button type='button' className='p-2 w-100 border-0' style={style.drawButton} onClick={drawCharacter} disabled={drawChances == 0 || new Date(currentDate) > julyFirst2024}>{new Date(currentDate) < julyFirst2024 ? drawChances == 0 ? '明天继续' : '抽字 (可抽 ' + drawChances + ' 次)' : '活动结束'}</button>
                        </div>
                        {new Date(currentDate) < julyFirst2024 &&
                            <div className="col-6">
                                <button type='button' className='p-2 w-100 border-0' style={style.prizeButton} onClick={drawBigPrize} disabled={prize == false}>抽大奖</button>
                            </div>
                        }
                    </div>
                </div>
            </div>

            {/* <Button variant="primary" onClick={handleShow}>
                Show Modal
            </Button> */}

            {modal &&
                <div className="custom-modal">
                    <div className="modal-content">
                        <div className="row justify-content-center mx-0">
                            <div className="col-12 text-center" style={{ width: '360px', height: '280px', background: '#E34234', borderRadius: '10px' }}>
                                {/* <div className="row justify-content-center align-items-center " style={{ height: '80%' }}> */}
                                <div className="parent d-flex justify-content-center align-items-center" style={{ height: '80%' }}>
                                    <div className="diamond">
                                        <div className="diamond-inner">{drawWords}</div>
                                    </div>
                                </div>
                                {/* </div> */}


                                <div className="row justify-content-center" style={{ height: '20%', color: 'white' }}>
                                    恭喜你获得一个{drawWords}字！
                                </div>
                            </div>

                            <span onClick={hideModal} className="close" style={{ color: 'white' }}><span>&times;</span></span>
                        </div>
                    </div>
                </div>
            }
            {modalBig &&
                <div className="custom-modal">
                    <div className="modal-content">
                        <div className="row justify-content-center mx-0">
                            <div className="col-12 text-center" style={{ width: '360px', height: '280px', background: '#E34234', borderRadius: '10px' }}>
                                {/* <div className="row justify-content-center align-items-center " style={{ height: '80%' }}> */}
                                <div className="row justify-content-center align-items-center" style={{ height: '80%' }}>
                                    {/* <div className="diamond"> */}
                                    <div className="col-6">
                                        <img className='img-fluid' src={voucher} alt=""></img>
                                    </div>
                                    {/* </div> */}
                                </div>
                                {/* </div> */}


                                <div className="row justify-content-center" style={{ height: '20%', color: 'white' }}>
                                    恭喜你获得一张100块现金卷！
                                </div>
                            </div>

                            <span onClick={hideModal} className="close" style={{ color: 'white' }}><span>&times;</span></span>
                        </div>
                    </div>
                </div>
            }

            {/* <CharModal show={true} handleClose={false} /> */}
        </div >


    );
};

export default Lottery;
