export default function FullscreenToggle() {
    const enter = async () => {
      const el = document.documentElement;
      if (!document.fullscreenElement && el.requestFullscreen) {
        await el.requestFullscreen();
      }
    };
    const exit = async () => {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    };
    return (
      <div className="flex gap-2">
        <button onClick={enter} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">To‘liq ekran</button>
        <button onClick={exit} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">Chiqish</button>
      </div>
    );
  }
  