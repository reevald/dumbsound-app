import imgHero from '../src-assets/image/hero-image.png';

function CompHero() {
  return (
    <div className='w-full relative'>
      <img className='min-h-screen object-cover' src={imgHero} alt="Hero DumbSound" />
      <div className='w-full flex flex-row justify-center items-center absolute inset-x-0 top-0 h-full'>
        <div className='flex flex-col items-center text-center w-full xl:max-w-7xl lg:max-w-5xl px-4 sm:px-8 md:px-16'>
          <div className='text-white text-4xl max-w-lg xl:text-6xl xl:max-w-2xl mb-5'>
            Connect on DumbSound
          </div>
          <div className='text-white max-w-lg xl:text-xl xl:max-w-2xl'>
            Discovery, stream, and share a constantly expanding mix of music from emerging and major artists around the world
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompHero;