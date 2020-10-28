import React, { Component } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'animate.css/animate.min.css';
import './home.css';
<<<<<<< HEAD
import Footer from '../../Components/Footer/Footer.js';
import { Row, Col } from 'reactstrap';
import { icons } from './IconConstants';


const SCEtitle = 'Software and \n Computer \n Engineering \n Society';

// The major block texts surrounding the sub block
const blockOneText =
  '\n\nOur clubroom offers everything a Software Engineering ' +
  'or Computer Engineering student could need. \n\n' +
  'We continue to offer resources to our ' +
  'members despite being remote. \n\n' +
  'Read further for more details!';

const blockTwoText =
  '\n\nJoin our public accounts on Discord, Slack, ' +
  'Instagram and more to connect with SCE members!';

// The sub block texts
// ( the part with the empty clubroom in the background )
const subBlockOneText =
  'As an SCE member, you will get inside scoops & opportunities.' +
  '\n\nWe have conducted events with companies like ' +
  'IBM, Tesla, SAP and more!';

const subBlockTwoText = 'Want to learn new technical skills? Or develop ' +
  'your interpersonal skills? \n\n' +
  'SCE hosts a range of free workshops taught by peers, ' +
  'our alumni and SJSU faculty!';

const subBlockThreeText =
  'Join us for fun and exciting social events for different occasions!' +
  '\n\nWe host potlucks, movie nights, game nights and much more!';

=======
//import Slideshow from '../../Components/Slideshow/Slideshow.js';
import Footer from '../../Components/Footer/Footer.js';
//import Jumbotron from '../../Components/Jumbotron/Jumbotron.js';
//import Iframe from 'react-iframe';
import { Row, Col, Container } from 'reactstrap';
// import Calendar from '../../Calendar/App.js'; <Calendar/>

/*
  <Iframe url="https://calendar.google.com/calendar/embed?src=
  llv828585faitko1m2nh39s3js%40group.calendar.google.co
  m&ctz=America%2FLos_Angeles"
        width="1000px"
        height="800px"
        id="myId"
        className="myClassname"
        display="initial"
        position="relative"
        allowFullScreen/>

        <Iframe url="https://calendar.google.com/calendar/b/4/embed?showTitle=
        0&amp;showPrint=0&amp;showTabs=0&amp;showCalendars=0&amp;showTz=0&amp;
        height=600&amp;wkst=1&amp;bgcolor=%23ffffff&amp;src=llv828585faitko1
        m2nh39s3js%40group.calendar.google.com&amp;color=%23182C57&amp;ctz=
        America%2FLos_Angeles" style="border-width:0" width="1000"
        height="850" frameborder="0" scrolling="no"/>
        */
>>>>>>> Fixes lint error

const blockOneText = [
  { title: 'Our clubroom offers everything a software or computer' },
  { title: 'engineering student could need.' },
  { title: <br /> },
  { title: 'We continue to offer resources to our members regardless' },
  { title: 'of being online. Join our discord for more details!' }
];

const blockTwoText = [
  { title: 'Join our public accounts on Discord, Slack,' },
  { title: 'Instagram and more today, and connect with SCE members' },
];

const text = 'Software and \n Computer \n Engineering \n Society';

class Home extends Component {
  render() {
    AOS.init();
    return (
      <>

        <div className='home'>

          {/* This container is for the SCE offciers picture and title */}
          <div class="groupPicContainer">
            <img class="groupictureStyles" src='images/officers2019_2.jpg'
              alt="officersPic" style={{ width: '100%' }}></img>
          </div>
          <div class="sceLogo" data-aos="fade-down" data-aos-duration="1000" >
            <div className="img-container">
              <img class="logo-styles"
                src='images/sce_logo_2.svg'
                alt="sce logo"
              ></img>
            </div>
            <Footer />
          </div>
          <div className="sceTitle" data-aos="fade-down"
            data-aos-duration="1000" >
            {SCEtitle}
          </div>

          {/* This contains all the content regarding the club,
         what we have to offer and social media links */}
          <div class="contentContainer">

            {/* The first major block: "Need a place to get things done?" */}
            <div className="block-one">
              <Row>
                <Col>
                  <div data-aos="fade-up"
                    data-aos="fade-down"
                    data-aos-duration="1000" >
                    <img className="block-images"
                      src='images/resume-workshop.jpg'
                      alt="blockOneImg"
                      style={{ width: '40vw', marginLeft: '15%' }}></img>
                  </div>

                </Col>
                <Col className="block-styles">
                  <h1 className="leftalign">
                    <span className="textBlock1-title">
                      Need a place to get things done?</span>
                  </h1>
                  <div class="textBlock1-text" >
                    <span className="blockText">{blockOneText}</span>
                  </div>
                </Col>
              </Row>
            </div>

            <div className="block-space" />

            {/* The sub block section */}
            <div className="clubRoomContainer">
              <p>
                <Row>
                  <Col className="column" xs={3}>
                    <div class="subBlock-title" data-aos="fade-up"
                      data-aos-duration="1000" >
                      Tech Events
                    </div>
                    <div class="subBlockContainer"
                      data-aos="fade-up"
                      data-aos-duration="2000" >
                      <span className="subBlockText">{subBlockOneText}</span>
                    </div>
                  </Col>
                  <Col xs={3} >
                    <div class="subBlock-title" data-aos="fade-up"
                      data-aos-duration="1000" >
                      Workshops
                    </div>
                    <div class="subBlockContainer"
                      data-aos="fade-up"
                      data-aos-duration="2000" >
                      <span className="subBlockText">{subBlockTwoText}</span>
                    </div>
                  </Col>
                  <Col xs={3}>
                    <div class="subBlock-title" data-aos="fade-right"
                      data-aos-duration="1000" >
                      Social Events
                    </div>
                    <div class="subBlockContainer"
                      data-aos="fade-up"
                      data-aos-duration="2000" >
                      <span className="subBlockText">{subBlockThreeText}</span>
                    </div>
                  </Col>
                </Row>
              </p>
            </div>

            {/* The second major block: "Want to know more?" */}
            <div className="block-two">
              <Row>
                <Col className="block-styles">
                  <h1>
                    <span class="textBlock2-title">
                      Want to know more?
                    </span>
                  </h1>
                  <div class="textBlock2-text" >
                    <span className="blockText">{blockTwoText}</span>
                  </div>

                  {/* Icons div */}
                  <div className="icons-container"
                    data-aos="fade-right"
                    data-aos-duration="1000">
                    {icons.map((icon, index) => {
                      return (
                        <a key={index} href={icon.link}>

                          <svg className='block2-icons' viewBox='0 0 24 24'>
                            <path fill='#484848' d={icon.vector} />
                          </svg>
                        </a>
                      );
                    })}
                  </div>
                </Col>
                <Col>
                  <div data-aos="fade-up" data-aos="fade-down"
                    data-aos-duration="1000" >
                    <img className="block-images"
                      src='images/Tesla2.jpg'
                      alt="blockOneImg"
                      style={{ width: '45vw', marginRight: '15%' }}></img>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="block-space" />
            <Footer />
          </div >
        </div >
      </>
}

  export default Home;
