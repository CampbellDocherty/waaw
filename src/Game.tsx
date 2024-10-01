import Draggable from 'react-draggable';

export const Game = ({ isProbablyWeb }: { isProbablyWeb: boolean }) => (
  <div className="game-screen">
    <button className="top-left hidden">{'<-'} socials</button>
    <p className="instructions hidden">
      {isProbablyWeb
        ? 'Collect the powerups using the arrow keys :)'
        : 'Collect the powerups by tilting your device :)'}
    </p>
    <button className="folder-button hidden" />
    {Array.from('abcde').map((_, index) => {
      return <button key={index} className="hide-button" />;
    })}
    <p className="hidden tracks">Tracks (0)</p>
    <Draggable bounds="parent">
      <div className="track-container" style={{ display: 'none' }}>
        <div className="track-container-title">Tracks</div>
        <div className="tracks-section"></div>
      </div>
    </Draggable>
  </div>
);
