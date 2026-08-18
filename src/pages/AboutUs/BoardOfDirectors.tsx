import founder from '../../assets/founder.avif';
import manjunath from '../../assets/manjunath.avif';
import prabhavathi from '../../assets/prabhavathi.avif';
import { motion } from 'framer-motion';

const BoardOfDirectors = () => {
  const directors = [
    {
      name: "Mr. Prakash B H",
      role: "Founder",
      image: founder,
      highlight: "Production Engineering with close to three decades of experience in manufacturing Industry, which includes green field project executions and management.",
      bio: [
        "Production Engineering with close to three decades of experience in manufacturing Industry, which includes green field project executions and management. A pro-active, result-oriented approach backed by unflinching commitment to promising as well as proven talents. He has nurtured and mentored many technical engineers, manufacturing professionals across manufacturing segments, who have today set an example as \"next generation entrepreneur\".",
        "He is a veteran in manufacturing segments and also known for his simplicity and down-2-earth. During his professional career he had set-up various 'Technical Skill Development Center' for different levels of Technicians, supervisors & Engineers in elevating their learning & skills up-gradation."
      ]
    },
    {
      name: "Mr. Manjunath B P",
      role: "Managing Director & CEO",
      image: manjunath,
      highlight: "Two decades of strategic Human Resources leadership driving organizational transformation across engineering, healthcare, steel, and global consulting verticals.",
      bio: [
        "Young, dynamic & bold Human Resources Leadership with Masters in Human Resources Management having more-than two decades of experience in Engineering Services, Product Development, BFSI, Consulting, Education, Healthcare, Steel and E-Governance domain vertical. In the course of which he has acquired both Business & Management Leadership Skills, which helped him to work closely with all Senior Management Professionals, Government bodies, Institutions and Communities on strategic planning, decisions, direction and implementation of core HR Development & Practices.",
        "In his earlier stint of professional career, he had engaged himself in various HR managerial & leadership roles with companies like NIIT Ltd., ITTI Pvt. Ltd. (an HUL partner), 3i Infotech Ltd. (Promoted by ICICI Bank Ltd.), Siemens Healthcare, Siemens Ltd., and Kalyani Steels Ltd. (a subsidiary of Bharat Forge Company) and so on.",
        "He has also extended his unconditional support to those people and trusts, who have undoubtedly served the country in all good and bad times by volunteering for many rehabilitation, 'giving' initiatives, disaster management, Tsunami affected community, concern towards clean & green environment, state floods support, literacy development, save tiger & wild-life campaign, global warming awareness program and skill development."
      ]
    },
    {
      name: "Mrs. Prabhavathi B Prakash",
      role: "Director",
      image: prabhavathi,
      highlight: "A powerful advocate and mentor for women's empowerment and vocational up-skilling, building supportive pathways for better community living.",
      bio: [
        "She has been a great source of energy, motivator, mentor & coach for many women's & girl child in their development and up-skilling. A qualified home science personnel having nearly three-decades of experiences and has been initially associated with Indian Telephone Industries and back office operations for Standard Chartered associates. She is a perfect example for women empowerment and find ways and different paths that leads for their \"better living\" thru continuous counseling and Training."
      ]
    }
  ];

  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh', paddingTop: '160px', paddingBottom: '10rem', color: 'var(--text-primary)', overflow: 'hidden', position: 'relative' }}>
      {/* Blueprint background grid for structural strength */}
      <div className="architectural-grid" />

      {/* Elegant coordinate line indicators */}
      <div style={{ position: 'absolute', top: '150px', left: '10%', width: '1px', height: '80%', background: 'linear-gradient(to bottom, rgba(197, 168, 128, 0.15) 0%, transparent 100%)', pointerEvents: 'none', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', top: '350px', left: '5%', right: '5%', height: '1px', background: 'rgba(197, 168, 128, 0.08)', pointerEvents: 'none', zIndex: 0 }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Editorial Header Section */}
        <div className="board-header" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'flex-end', marginBottom: '8rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="section-subtitle">Executive Leadership</span>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(3rem, 7vw, 5.2rem)',
              fontWeight: 500,
              lineHeight: 0.95,
              color: 'var(--navy)',
              margin: '0.5rem 0 0 0'
            }}>
              Board of <br />
              <span style={{ fontStyle: 'italic', color: 'var(--primary)' }}>Directors</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="board-quote-block"
            style={{ borderLeft: '1px solid var(--primary)', paddingLeft: '2.5rem', paddingBottom: '0.5rem' }}
          >
            <p style={{ 
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.5rem', 
              color: 'var(--primary-hover)', 
              fontWeight: 400, 
              fontStyle: 'italic',
              lineHeight: 1.5,
              margin: '0 0 1rem 0'
            }}>
              "We only make Right Decisions."
            </p>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px', color: 'var(--navy)', textTransform: 'uppercase' }}>
              Corporate Vision & Governance
            </span>
          </motion.div>
        </div>

        {/* Directors List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10rem' }}>
          {directors.map((director, i) => (
            <div
              key={i}
              className="director-row"
              style={{
                display: 'grid',
                gridTemplateColumns: i % 2 === 0 ? '1fr 1.4fr' : '1.4fr 1fr',
                gap: '5rem',
                alignItems: 'start'
              }}
            >
              {/* Image Section - Left/Right alternating */}
              <div className="director-image-container" style={{ order: i % 2 === 0 ? 1 : 2, position: 'relative' }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8 }}
                  style={{
                    position: 'relative',
                    background: 'var(--navy)',
                    padding: '15px',
                    borderRadius: '2px',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 25px 50px rgba(11,17,32,0.06)'
                  }}
                >
                  {/* Thin gold border offset */}
                  <div style={{
                    position: 'absolute',
                    top: '-1px',
                    left: '-1px',
                    right: '-1px',
                    bottom: '-1px',
                    border: '1px solid var(--primary)',
                    pointerEvents: 'none',
                    zIndex: 2
                  }} />

                  <div style={{ overflow: 'hidden', aspectRatio: '4/5', position: 'relative' }}>
                    <motion.img
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.6 }}
                      src={director.image}
                      alt={director.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  
                  <div style={{
                    padding: '1.5rem 0.5rem 0.5rem 0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem'
                  }}>
                    <h2 style={{ 
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '2rem', 
                      fontWeight: 600, 
                      color: '#fff',
                      margin: 0
                    }}>{director.name}</h2>
                    <h3 style={{ 
                      fontSize: '0.8rem', 
                      color: 'var(--primary)', 
                      fontWeight: 800,
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      margin: 0
                    }}>{director.role}</h3>
                  </div>
                </motion.div>
                
                {/* Secondary decorative frame backing */}
                <div 
                  className="director-dashed-backing"
                  style={{
                    position: 'absolute',
                    top: '25px',
                    left: i % 2 === 0 ? '-25px' : '25px',
                    right: i % 2 === 0 ? '25px' : '-25px',
                    bottom: '-25px',
                    border: '1px dashed var(--primary)',
                    opacity: 0.35,
                    borderRadius: '2px',
                    zIndex: -1
                  }}
                ></div>
              </div>

              {/* Bio Section - Left/Right alternating */}
              <div className="director-bio-container" style={{ order: i % 2 === 0 ? 2 : 1 }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    <span>Executive Profile</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                  </div>

                  {/* Redesigned drop-cap paragraph */}
                  {director.bio.map((paragraph, j) => (
                    <p
                      key={j}
                      className={j === 0 ? "drop-cap" : ""}
                      style={{
                        color: j === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                        lineHeight: 1.85,
                        fontSize: '1.05rem',
                        textAlign: 'justify',
                        margin: 0
                      }}
                    >
                      {paragraph}
                    </p>
                  ))}

                  {/* Elegant gold pull-quote highlight */}
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: 'italic',
                    fontSize: '1.45rem',
                    lineHeight: '1.5',
                    color: 'var(--navy)',
                    borderLeft: '2px solid var(--primary)',
                    paddingLeft: '1.5rem',
                    margin: '2rem 0 1rem 0',
                    maxWidth: '550px'
                  }}>
                    "{director.highlight}"
                  </div>
                </motion.div>
              </div>

            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .board-header {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            margin-bottom: 5rem !important;
          }
          .board-quote-block {
            border-left: none !important;
            border-top: 1px solid var(--primary) !important;
            padding-left: 0 !important;
            padding-top: 1.5rem !important;
          }
          .director-row {
            grid-template-columns: 1fr !important;
            gap: 4rem !important;
          }
          .director-image-container {
            order: 1 !important;
            max-width: 480px;
            margin: 0 auto;
            width: 100%;
          }
          .director-bio-container {
            order: 2 !important;
          }
        }
        @media (max-width: 768px) {
          .director-dashed-backing {
            left: 8px !important;
            right: 8px !important;
            top: 8px !important;
            bottom: -8px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BoardOfDirectors;
