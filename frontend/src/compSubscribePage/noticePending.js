function CompNoticePending() {
  return (
    <div className='flex flex-row justify-center py-16 w-full'>
      <div className='flex flex-col items-center h-full w-full xl:max-w-7xl lg:max-w-5xl px-4 sm:px-8 md:px-36'>
        <div className="text-3xl font-bold mb-10 mt-16 text-white">
        <span className="text-orange-ds-200">Pending</span> Status
        </div>
        <div className="text-white font-light mb-3 max-w-lg text-center">
          Pembelian paket premium Anda sedang kami proses sesegera mungkin. Apabila membutuhkan bantuan silahkan hubungi nomor berikut.
        </div>
        <div className="mb-6">
          <span className="font-semibold text-white"><span className="text-orange-ds-200">DUMB</span>SOUND : 0981312323</span>
        </div>
      </div>
    </div>
  );
}

export default CompNoticePending;