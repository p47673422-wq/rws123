"use client";
import React from "react";
import "../eventR.css";
import "../eventResponsive.css";
import "../../home-custom.css";

export default function GaneshVideoPage() {

  return (
    <div className="content-overlay">
      <style>{`
        @media (max-width: 600px) {
          .responsive-iframe-inner {
            min-height: 220px !important;
            max-width: 100vw !important;
            border-radius: 0.7rem !important;
          }
          .responsive-iframe-inner iframe {
            min-height: 220px !important;
            max-height: 40vh !important;
            border-radius: 0.7rem !important;
          }
        }
      `}</style>
      <div className="comeCustomBox1 current-event-shell responsive-event-shell event-detail-fadein">
        <button className="back-btn" onClick={() => window.history.back()}>← Back</button>
        <div className="ganesha-attract-text">Great Personality – Lord Gaṇeśa...<br/>The Remover of Obstacles</div>
        <h2 className="fancyTitle event-title" style={{textAlign: 'center', marginBottom: '1.5rem'}}>Illustrated Story of Lord Gaṇeśa</h2>
        <div className="event-detail-img-wrap" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem'}}>
          <div className="responsive-iframe-wrap">
            <div
              className="responsive-iframe-inner"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '900px',
                margin: '0 auto',
                aspectRatio: '16/9',
                height: 'auto',
                minHeight: '320px',
                borderRadius: '1.2rem',
                boxShadow: '0 4px 32px rgba(196,79,0,0.12)',
                border: '2px solid #ffe082',
                background: '#fff',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <iframe
                src="https://www.youtube.com/embed/dRwzeZGCPhY?si=QxUQmduflQtSgOXd"
                title="Illustrated Story of Lord Gaṇeśa"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '320px',
                  maxHeight: '70vh',
                  borderRadius: '1rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  background: '#fff',
                  border: 'none',
                  display: 'block',
                }}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

