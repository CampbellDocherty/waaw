import Draggable from 'react-draggable';

export const Game = ({ isProbablyWeb }: { isProbablyWeb: boolean }) => (
  <div className="game-screen">
    <p className="instructions hidden">
      {isProbablyWeb
        ? 'Collect the powerups using the arrow keys :)'
        : 'Collect the powerups by tilting your device :)'}
    </p>
    <button className="folder-button hidden" />
    <p className="hidden tracks">Tracks (0)</p>
    {isProbablyWeb ? (
      <Draggable bounds="parent">
        <div className="track-container" style={{ display: 'none' }}>
          <button className="track-container-close">x</button>
          <div className="tracks-section"></div>
        </div>
      </Draggable>
    ) : (
      <div className="track-container" style={{ display: 'none' }}>
        <button className="track-container-close">x</button>
        <div className="tracks-section"></div>
      </div>
    )}
    <button id="about-btn" className="bottom-right hidden">
      about {'->'}
    </button>

    <div className="star-builder" style={{ display: 'none' }}>
      <div className="star-builder-row">
        <span className="star-builder-label">Spikes</span>
        <div className="star-builder-options" data-group="spikes">
          <button data-value="3">3</button>
          <button data-value="4">4</button>
          <button data-value="5" className="selected">
            5
          </button>
          <button data-value="6">6</button>
          <button data-value="8">8</button>
        </div>
      </div>
      <div className="star-builder-row">
        <span className="star-builder-label">Length</span>
        <div className="star-builder-options" data-group="length">
          <button data-value="22">1</button>
          <button data-value="18">2</button>
          <button data-value="15" className="selected">
            3
          </button>
          <button data-value="10">4</button>
          <button data-value="5">5</button>
        </div>
      </div>
      <div className="star-builder-row">
        <span className="star-builder-label">Colour</span>
        <div className="star-builder-options" data-group="colour">
          <button
            data-value="#F8FF6E"
            style={{ backgroundColor: '#F8FF6E' }}
          ></button>
          <button
            data-value="#F875FC"
            style={{ backgroundColor: '#F875FC' }}
          ></button>
          <button
            data-value="#F927FF"
            style={{ backgroundColor: '#F927FF' }}
          ></button>
          <button
            data-value="white"
            className="selected"
            style={{ backgroundColor: 'white' }}
          ></button>
          <button
            data-value="#803EFF"
            style={{ backgroundColor: '#803EFF' }}
          ></button>
          <button
            data-value="#4200AA"
            style={{ backgroundColor: '#4200AA' }}
          ></button>
        </div>
      </div>
      <div className="star-builder-row">
        <span className="star-builder-label">Name</span>
        <input
          type="text"
          className="star-builder-name"
          placeholder="Enter name"
          maxLength={12}
          required
        />
      </div>
      <button className="star-builder-start">Start</button>
    </div>
  </div>
);
