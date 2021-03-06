import React, { useState, useEffect } from 'react';
import './argon.scss'
import { Button ,Row ,Col} from 'reactstrap';
import photo from './assets/images/photo.jpg';
import data from './assets/data.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons'
import { CSSTransition } from 'react-transition-group';
import * as comp from './styled';
import { Octokit } from '@octokit/rest';
import ReactMarkdown from 'react-markdown'
import basididati from './assets/projects/basididati.md';
import basididatiLogo from './assets/images/basididati.png';
import ingegneriadelsoftware from './assets/projects/ingegneriadelsoftware.md';
import ingegneriadelsoftwareLogo from './assets/images/ingegneriadelsoftware.png';
import mobdevandroid from './assets/projects/mobdevandroid.md';
import mobdevandroidLogo from './assets/images/mobdevandroid.jpg';
import mobdevios from './assets/projects/mobdevios.md';
import mobdeviosLogo from './assets/images/mobdevios.png';
import { BehaviorSubject } from 'rxjs';
import { scan } from 'rxjs/operators';
import Skeleton from "react-loading-skeleton";

const ocktokit = new Octokit();
const repositories = new BehaviorSubject([]);

data.repositories.forEach(repository => {
  ocktokit.repos.get({
    owner: repository.owner,
    repo: repository.repo
  }).then(value => {
    const repo = {
      name: value.data.full_name,
      description: value.data.description,
      language: value.data.language,
      stars: value.data.stargazers_count,
      watchers: value.data.watchers_count,
      fork: value.data.forks_count,
      url: value.data.html_url
    }
    repositories.next({ [repo.name]: repo })
  });
})

  // https://stackoverflow.com/a/21984136/6791579
function _calculateAge(birthday) { // birthday is a date
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const TopSideContainer = function(props) {
  return <Col xs="6" className={`d-flex justify-content-center align-items-center ${props.className}`}>{props.children}</Col>
}

const Avatar = function () {
  return <comp.AvatarContainer className="justify-content-center d-flex order-1 order-sm-1 order-lg-2 p-0" md="12" sm="12" lg="auto">
    <div className="card-profile-image">
      <img alt="" className="m-0 rounded-circle" src={photo}></img>
    </div>
  </comp.AvatarContainer>
}

const IconWithDesc = function (props) {
  if (props.icon.hasOwnProperty("link")) {
    return <comp.IconContainer {...props}>
      <a href={props.icon.link}>
        <FontAwesomeIcon size={props.iconSize ? props.iconSize : "2x"} icon={props.icon.icon} />
      </a>
      <a href={props.icon.link}><span>{props.icon.name}</span></a>
    </comp.IconContainer>
  } else {
    return <comp.IconContainer {...props}>
      <FontAwesomeIcon size={props.iconSize ? props.iconSize : "2x"} icon={props.icon.icon} />
      <span>{props.icon.name}</span>
    </comp.IconContainer>
  }
}

const SocialIcons = function (props) {
  const icons = data.social.map((icon, index) => {
    if (index !== data.social.length-1) {
      return <IconWithDesc key={index} icon={icon} className="pr-4" />
    } else {
      return <IconWithDesc key={index} icon={icon} />
    }
  })
  return <Row className="justify-content-center">{icons}</Row>
}

const TopBar = function() {
  return <Row className="justify-content-center">
      <TopSideContainer className="pt-7 pt-md-3 order-2 order-sm-2 col-sm-6 order-lg-1 col-lg-6">
        <SocialIcons/>
      </TopSideContainer>
      <Avatar/>
      <TopSideContainer className="pt-7 pt-md-3 order-3 order-md-3 col-sm-6 order-lg-3 col-lg-6" >
        <a href={`mailto:${data.contact_email}`}><Button color="primary">Contact Me</Button></a>
      </TopSideContainer>
    </Row>
}

const PersonalDetails = function () {
  const schoolsData = data.details.school.map((school, index) => <div key={index} className="h6 mt-2">
    <span className="font-weight-lighter">{school.type}</span> @ <span>{school.name}</span>
  </div>)
  const languages = data.details.programming.map((value, index) => <Col key={index} xs="auto"><IconWithDesc icon={value} /></Col>)
  return <Row className="justify-content-center d-flex mt-4 mt-md-7">
    <Col style={{minWidth: "256px"}} lg='auto' className="justify-content-center text-center">
      <h3>
        {`${data.details.name} ${data.details.surname}`}
        <span className="font-weight-light">
          {`, ${_calculateAge(new Date(data.details.birthdate))}`}
        </span>
      </h3>
      <div className="h6 font-weight-300">
        {data.details.city}, {data.details.state}
      </div>
      {schoolsData}
      <div className="mt-2">{data.details.hobbies}</div>
      <Row className="mt-5 justify-content-center">{languages}</Row>
    </Col>
  </Row>
}

const OtherContacts = function () {

  const DropDownContacts = function (props) {
    const [opened, setOpened] = useState(false);

    const toggleDropDown = () => {
      if (opened === false) {
        setOpened(true);
      } else {
        setOpened(false); 
      }
    }
    
    return <CSSTransition in={opened} timeout={400} classNames="dropDownSectionWrapper">
      <comp.RowSection {...props} className={`${props.className} dropDownSection`}>
      <CSSTransition in={opened} timeout={400} classNames="dropDownChevron">
        <div onClick={toggleDropDown} className="d-flex w-100 justify-content-center">
          <comp.MoreChevron className="mt--2 rounded-circle shadow-sm" style={{color: "var(--light)"}} icon={faChevronCircleDown} />
        </div>
      </CSSTransition>
      <CSSTransition in={opened} timeout={400}  classNames="dropDownSection">
        <comp.MoreContainer xs="12" className=" justify-content-center">
          {props.children}
        </comp.MoreContainer>
      </CSSTransition>
      </comp.RowSection> 
    </CSSTransition>
  }

  const dataDesc = Object.keys(data.details.more).map((data, index) => <Row key={`desc-${index}`} className="text-right d-block font-weight-bold">{data}</Row>)
  const dataSep = Object.keys(data.details.more).map((_ , index) => <Row key={`sep-${index}`}>:</Row>)
  const dataValues = []
  for (const key in data.details.more) {
    if (data.details.more.hasOwnProperty(key)) {
      dataValues.push(<Row key={`val-${key}`}>{data.details.more[key]}</Row>);
    }
  }

  return <DropDownContacts>
    <Col xs="auto">{dataDesc}</Col>
    <Col xs="auto" className="px-1 px-md-2">{dataSep}</Col>
    <Col xs="auto">{dataValues}</Col>
  </DropDownContacts>
}

const WhoAmI = function (props) {
  return <comp.RowSection border="false">
      <Col xs="auto">
        <Row className="justify-content-center" ><h2 className="text-weight-bold text-center">Who I am?</h2></Row>
        <Row className="justify-content-center text-center">{data.whoiam}</Row>
      </Col>
    </comp.RowSection>
}

const ProjectContainer = function (props) {
  return <Row className="mt-5 justify-content-center">
    <Col xs="12" md="12" lg="auto" className="p-0 position-relative d-flex justify-content-center">
      <comp.ProjectImg className="rounded-lg shadow overflow-hidden" alt="" src={props.image}/>
    </Col>
    <Col className="mx-5 mt-sm-3 mt-md-2 mt-lg-0">
      <ReactMarkdown>{props.markdown}</ReactMarkdown>
    </Col>
  </Row>
}

const ProgettiUni = function (props) {
  return <comp.Section title="Progetti Universitari">
      <ProjectContainer image={basididatiLogo} markdown={basididati} />
      <ProjectContainer image={ingegneriadelsoftwareLogo} markdown={ingegneriadelsoftware} />
      <ProjectContainer image={mobdevandroidLogo} markdown={mobdevandroid} />
      <ProjectContainer image={mobdeviosLogo} markdown={mobdevios} />
  </comp.Section>
}

const useGithubRepos = (initialObservable) => {
  const [repos, setRepos] = useState([]);
  const [observable, setRepoObservable] = useState(initialObservable);
  useEffect(() => {
    observable.pipe(
      scan((acc, value) => { return Object.assign({}, acc, value) }, {})
    ).subscribe((value) => {
      setRepos(value);
    });

    return () => observable.unsubscribe();
  }, [observable]);
  return [repos, setRepoObservable]
};

const GithubProject = function (props) {
  const bottombar = []
  if (props.proj?.fork !== 0) {
    bottombar.push(<Col xs="auto" className="mr-2"><FontAwesomeIcon icon={["fas", "code-branch"]} /> {props.proj?.fork}</Col>)
  }
  if (props.proj?.stars !== 0) {
    bottombar.push(<Col xs="auto" className="mr-2"><FontAwesomeIcon icon={["far", "star"]} /> {props.proj?.stars}</Col>)
  }
  if (props.proj?.watchers !== 0) {
    bottombar.push(<Col xs="auto" className="mr-2"><FontAwesomeIcon icon={["far", "eye"]} /> {props.proj?.watchers}</Col>)
  }
  return <Col xs="12" md="6" lg="6" className="my-2 align-items-stretch">
    <div className="border rounded p-4 w-100 h-100">
      <div className={(props.proj === undefined) ? "text-nowrap" : ""}>
        <FontAwesomeIcon icon={['fas', 'book']} />
        <a className="font-weight-bold ml-1" href={props.proj?.url || "#"} style={(props.proj === undefined) ? { lineHeight: 1, minWidth: "200px" } : {}}>{props.proj?.name || <Skeleton className="pr-5"/>} </a>
      </div>
      <div className="mt-2" style={(props.proj === undefined) ? { lineHeight: 1, minWidth: "200px" } : {}}>{props.proj?.description || <Skeleton />}</div>
      <Row className="mt-2">
        {bottombar}
      </Row>
    </div>
  </Col>
}

const ProgettiPers = function (props) {
  const [repos, setRepos] =  useGithubRepos(repositories);

  useEffect(() => {setRepos(repositories)})

  const skeletals = data.repositories.map((value, index) => {
    console.log(repos[`${value.owner}/${value.repo}`])
    return <GithubProject proj={repos[`${value.owner}/${value.repo}`]} />
  })

  return <comp.Section title="Progetti Personali">
    <Row className="mt-5 align-items-stretch">
      {skeletals}
    </Row>
  </comp.Section>
}

function App() {
  return (<>
  <comp.AppWrapper className="profile-page">
    <comp.AppContainer className="card card-profile shadow mt-0 pb-5" fluid>
      <TopBar />
      <PersonalDetails />
      <OtherContacts />
      <WhoAmI />
      <ProgettiUni />
      <ProgettiPers />
    </comp.AppContainer>
  </comp.AppWrapper>
  <comp.BgStatic/>
  </>);
}

export default App;
