import ReactGA from 'react-ga';


export const handleOutBoundLink = () => {
  ReactGA.outboundLink({
    label: 'clicked external link'
  },function(){
    console.log('outbound link click.');
  });
}
