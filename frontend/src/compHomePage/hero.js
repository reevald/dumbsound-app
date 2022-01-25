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
          <div className='text-white max-w-lg xl:text-xl xl:max-w-2xl mb-5'>
            Discovery, stream, and share a constantly expanding mix of music from emerging and major artists around the world
          </div>
          <div className='max-w-lg xl:text-xl xl:max-w-2xl'>
            <a href="#section-playlist">
              <div className='bg-orange-ds-200 text-white font-semibold hover:bg-orange-ds-100 py-2 px-6 rounded-md'>
                Play Now
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompHero;