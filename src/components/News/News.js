import React from "react";

// Styles
import "./News.css";

export default function News() {
  return (
    <section className="container-main">
      <main className="main">
        <div className="main__title">
          <h2>LATEST NEWS</h2>
        </div>
        <div className="main__image">
          <div className="title">
            <h3>VAPORWAVE: SUCH A VIBE!</h3>
          </div>
          <div className="date">
            <p>
              Aug 2, 2021 | <strong>Campaigns & Activities</strong>
            </p>
          </div>
          <div className="info">
            <p>
              Who likes synth-wave music? Who likes Miami beaches? Who likes
              irresistibly cool mullets? US TOO!
            </p>
          </div>
        </div>
        <div className="main__news">
          <div className="item-new i-1"></div>
          <div className="item-new i-2"></div>
          <div className="item-new i-3"></div>
          <div className="item-new i-4"></div>
          <div className="item-new i-5"></div>
          <div className="item-new i-6"></div>
        </div>
        <div className="main__more-news">
          <span>
            MORE NEWS <strong>&gt;&gt;</strong>
          </span>
        </div>
      </main>
      <aside className="aside">
        <div className="card">
          <div className="card__title">
            <h3>SAFETY TIPS</h3>
          </div>
          <div className="card__body">
            <p>
              Protect yourself with awareness! Learn how to
              <strong>stay safe on the internet.</strong>
            </p>
          </div>
        </div>
        <div className="card">
          <div className="card__title">
            <h3>PARENTS' GUIDE</h3>
          </div>
          <div className="card__body">
            <p>
              Curious about the effective tools that ensure our users can have
              fun in a safe environment? See our
              <strong>Parents' Guide on the Customer Support & Helpdesk</strong>
              pages.
            </p>
          </div>
        </div>
      </aside>
    </section>
  );
}
