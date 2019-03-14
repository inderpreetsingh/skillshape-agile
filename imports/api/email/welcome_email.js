import { getUserFullName } from "/imports/util/getUserData";

export const welcomeEMail = (user, verificationToken, passwd, fromEmail, toEmail, schoolName) => {
  const userName = getUserFullName(user);

  return `<div class="wrapper" style="font-family: 'Zilla Slab', serif;color: #524444;font-weight: 300;font-size: 16px;line-height: 1.5;">
  <div class="header" style="width: 100%;">
    <div class="header-content" style="width: 200px;margin: auto;">
      <div class="logo-container" style="width: 50px;display: inline-block;">
        <img src="https://cdn.discordapp.com/attachments/544533857035223040/555277466629832724/logo.png" style="width: 100%;vertical-align: bottom;">
      </div>
      <div class="heading" style="display: inline-block;padding: 20px 0;">
        <h1 style="font-weight: light;font-size: 24px;color: #AC1616;margin: 0;line-height: 1;">Skillshape</h1>
        <p class="two" style="font-size: 16px;margin: 0;line-height: 1;">your path revealed</p>
      </div>
    </div>
  </div>
    <div class="body">
      <div class="content" style="max-width: 300px;margin: auto;font-style: italic;">
        <h3 style="font-weight: 300;text-align: center;padding-top: 20px;font-size: 20px;font-style: italic;margin: 0;"> Hey 👋 </h3>
        <h2 style="font-weight: 300;text-align: center;font-size: 32px;margin: 0;padding: 0;">${userName},</h2>
        <p>Welcome to skillshape. You are just one step away from adding your school.Just click on button below</p>
        <a href=${verificationToken}} style="width: 100%;height: 25px;background-color: green;border: none;color: white;padding: 15px 0px;text-align: center;display: inline-block;font-size: 19px;cursor: pointer;font-family: 'Zilla Slab', serif;font-style: italic;border-radius: 5px;">Confirm your email</a>
        <p>or open this link in your browser. ${verificationToken} </p>
        <p>Your password is <b> ${passwd}<b/> </p>
        <p>I am sam, founder of Skillshape.com. If you have any questions, comments or suggestions, just hit reply.</p>
        <p class="mini" style="font-size: 14px;font-style: italic;margin-bottom: 0px;">If you do not remember signing up for this,<a href="#" style="text-decoration: none;">click here to unsubscribe.</a></p>
  
      </div>
    </div>
  
    <div class="footer" style="height: 30px;font-size: 14px;font-family: 'Zilla Slab', serif;font-style: italic;background: #ccc;text-align: center;">
      <p class="links" style="margin: 0;"><a href="#" style="text-decoration: underline;line-height: 30px;color: #666;">facebook</a>, <a href="#" style="text-decoration: underline;line-height: 30px;color: #666;">twitter</a>, <a href="#" style="text-decoration: underline;line-height: 30px;color: #666;">instagram</a>, <a href="#" style="text-decoration: underline;line-height: 30px;color: #666;">skillshape.com</a></p>
    </div>
  
  </div>`;
}