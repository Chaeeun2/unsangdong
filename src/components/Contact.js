import React from 'react';
import './Contact.css';

function Contact() {
  return (
      <div className="contact-container">
          <div className="contact-left-wrap">
              <div className="contact-title">CONTACT</div>
              <div className="contact-info">
                  <div className="contact-address">
                      <p className="contact-address-ko">서울특별시 성북구 창경궁로 43길 41</p>
                      <p className="contact-address-en">41, Changgyeonggung-ro 43-gil, Seongbuk-gu, Seoul, South Korea</p>
                  </div>
                  <div className="contact-number-wrap">
                      <div className="contact-number-title-wrap">
                            <p className="contact-number-title">Email</p>
                            <p className="contact-number-title">Tel</p>
                            <p className="contact-number-title">Fax</p>
                            <p className="contact-number-title">SNS</p>
                      </div>
                      <div className="contact-number-content-wrap">
                            <p className="contact-number-content"><a href="mailto:usdspace2007@naver.com">usdspace2007@naver.com</a></p>
                            <p className="contact-number-content">+82 2-764-8401</p>
                            <p className="contact-number-content">+82 2-764-8403</p>
                            <p className="contact-number-content"><a href="https://www.instagram.com/unsangdong/" target="_blank">@unsangdong</a></p>
                      </div>
                  </div>
              </div>
              </div>
             <div className="contact-right-wrap">
         <div className="contact-form-section">
           <form className="contact-form">
             <div className="form-row company-name">
               <div className="form-group">
                 <label className="form-label">회사명</label>
                 <input 
                   type="text" 
                   className="form-input" 
                   placeholder="Company name"
                   required
                 />
               </div>
             </div>
             
             <div className="form-row your-name">
               <div className="form-group">
                 <label className="form-label">담당자 성함</label>
                 <input 
                   type="text" 
                   className="form-input" 
                   placeholder="Your name"
                   required
                 />
               </div>
             </div>
             
             <div className="form-row e-mail">
               <div className="form-group">
                 <label className="form-label">이메일</label>
                 <input 
                   type="email" 
                   className="form-input" 
                   placeholder="E-mail"
                   required
                 />
               </div>
             </div>
             
             <div className="form-row phone-number">
               <div className="form-group">
                 <label className="form-label">담당자 연락처</label>
                 <input 
                   type="tel" 
                   className="form-input" 
                   placeholder="Phone Number"
                   required
                 />
               </div>
             </div>
             
             <div className="form-row">
               <div className="form-group">
                 <label className="form-label">문의 제목</label>
                 <input 
                   type="text" 
                   className="form-input" 
                   placeholder="Inquiry title"
                   required
                 />
               </div>
             </div>
             
             <div className="form-row">
               <div className="form-group">
                 <label className="form-label">문의 내용</label>
                 <textarea 
                   className="form-textarea" 
                   rows="8"
                   placeholder="Describe your inquiry"
                   required
                 ></textarea>
               </div>
             </div>
             
             <div className="form-row">
               <button type="submit" className="form-submit-btn">
                 CONTACT<span className="form-submit-btn-arrow">→</span>
               </button>
             </div>
           </form>
         </div>
       </div>
    </div>
  );
}

export default Contact; 