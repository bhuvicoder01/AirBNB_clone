import React from 'react'
import SearchBar from '../search/SearchBar'
import { useLanguage } from '../../contexts/LanguageContext';

function Hero() {
      const { t } = useLanguage();
    
  return (<>
   {window.innerWidth > 768 &&(
           <div className="position-relative py-5" style={{ minHeight: '500px', overflow: 'visible' }}>
             <video
               autoPlay
               loop
               muted
               playsInline
               style={{
                 position: 'absolute',
                 top: 0,
                 left: 0,
                 width: '100%',
                 height: '100%',
                 objectFit: 'cover',
                 zIndex: -1
               }}
             >
               <source src="/hero_video.mp4" type="video/mp4" />
             </video>
             <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 0 }}></div>
             <div className="container position-relative" style={{ zIndex: 1 }}>
               <div className="text-center mb-4">
                 <h1 className="display-4 fw-bold mb-3 text-white">{t('findNextStay') || 'Find your next stay'}</h1>
                 <p className="lead text-white">
                   Search deals on hotels, homes, and much more...
                 </p>
               </div>
               <div className="row justify-content-center">
                 <div className="col-lg-8">
                   <SearchBar />
                 </div>
               </div>
             </div>
           </div>
         ) }
 </> )
}

export default Hero