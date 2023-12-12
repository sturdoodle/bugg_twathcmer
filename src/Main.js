import React, { useState } from 'react'
import { timerdata } from './constant'
import Timer from './Timer'
// import { Modal } from "react-bootstrap";

function Main() {
  const [displayTimerPage, setDisplayTimerPage] = useState(0)
  const [onclickTimer, setOnClickTimer] = useState(null)
  // const [modalShow, setModalShow] = useState(false);
  // const [Custom_TimerInput, setCustom_TimerInput] = useState({
  //   "DD": "1",
  //   "HH": "24",
  //   "MM": "60",
  //   "SS": "60",
  // })


  const handleClick = (item) => {
    setDisplayTimerPage(1)
    setOnClickTimer(item)
  }

  // function handleCustomInput(e) {
  //   console.log(e.target.name, "---", e.target.value)
  //   setCustom_TimerInput({ ...Custom_TimerInput, [e.target.name]: e.target.value })

  // }

  // function handleOnClickStartTimer() {
  //   setModalShow(false)
  //   handleClick(Custom_TimerInput)
  // }


  const Initialdisplay = () => {
    return (
      <>
        {/* <div className='display-5 mt-3 text-center'> ⏱️ Focus | 🧐 Concentrate <span  className='fs-6'>By Shyam</span></div> */}
        <div className='display-5 mt-3 text-center mb-2'> ⏱️ Focus | 🧐 Pormodoro </div>
        <p className='lead text-center text-decoration-none'>Pormodoro - Manage Your ⏱️ Time And Focus On any Tasks</p>
        <div className='text-center text-decoration-underline fs-5 mb-3'> Select the Timer </div>
        
        <div className='container mx-auto py-3'>
          <div className='row'>
            {/* start */}
            {/* <div className="col-md-6 col-lg-3 col-sm-6 item ">
              <button type="button" className="btn btn-lg btn-block" onClick={() => setModalShow(true)}>
                <div className="card item-card card-block m-2 p-3">
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary p-2">custom</span>
                  <h5 className="item-card-title mt-3 mb-3 display-6 text-wrap">Custom</h5>
                  <p className="card-text fs-6 text-wrap">DD:HH:MM:SS </p>
                </div>
              </button>
            </div>
            <Modal
              size="md"
              show={modalShow}
              onHide={() => setModalShow(false)}
              backdrop="static"
              keyboard={false}
              centered
              aria-labelledby="example-modal-sizes-title-sm"
            >
              <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-sm">
                  Set Custom Timer ⏱️
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className='container mx-auto w-75'>
                  <div className="row">
                    <input type="number" min="00" max="31" style={{ border: "none" }} name="DD" onChange={(e) => handleCustomInput(e)} className="form-control col-sm" placeholder='DD' />
                    <input type="number" min="00" max="24" style={{ border: "none" }} name="HH" onChange={(e) => handleCustomInput(e)} className="form-control col-sm" placeholder='HH' />
                    <input type="number" min="00" max="60" style={{ border: "none" }} name="MM" onChange={(e) => handleCustomInput(e)} className="form-control col-sm" placeholder='MM' />
                    <input type="number" min="00" max="60" style={{ border: "none" }} name="SS" onChange={(e) => handleCustomInput(e)} className="form-control col-sm" placeholder='SS' />
                  </div>
                  <div className='row m-4'>
                    <button className='btn btn-success' onClick={handleOnClickStartTimer}>Start ⏱️</button>
                  </div>
                </div>
              </Modal.Body>
            </Modal> */}
            {/* end */}

            {timerdata && timerdata.map((item) =>
              <div key={item.id} className="col-md-6 col-lg-3 col-sm-6 item">
                <button key={item.id} type="button" className="btn  btn-lg btn-block" onClick={() => handleClick(item)}>
                  <div className="card item-card card-block m-2 p-3">
                    {item.Rating !== "" ? <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger p-2">{item.Rating}</span> : null}
                    {/* <h6 className="lead text-right">{item?.Rating}</h6> */}
                    <h5 className="item-card-title mt-3 mb-3 display-6 text-wrap">{item.title.replaceAll("-", ":")} </h5>
                    <p className="card-text fs-6 text-wrap">{item.description}</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

      </>
    )
  }
  if (displayTimerPage === 1) {
    return <Timer data={onclickTimer} goback={setDisplayTimerPage} />
  }
  else {
    return Initialdisplay()
  }
}

export default Main