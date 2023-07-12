import { ReactNode, useEffect, useRef } from 'react';
import { Tooltip } from 'tw-elements';

export default function CopyButton({
  text,
  className,
  children,
}: {
  text: string;
  className?: string;
  children: ReactNode;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const toolTipRef = useRef<ToolTipInterface>();

  useEffect(() => {
    toolTipRef.current = new Tooltip(buttonRef.current);
    return () => toolTipRef.current?.dispose();
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={handleClick()}
      data-te-toggle="tooltip"
      data-te-placement="top"
      data-te-trigger="manual"
      data-te-title="Copied"
      className={className}
    >
      {children}
    </button>
  );

  function handleClick() {
    return async () => {
      const button = getButton();
      await CopyTextToClipBoard();
      disableButton(button);
      showTooltip();
      enableButtonAndHideTooltipAfter3Secs(button);
    };

    function getButton() {
      return buttonRef.current as HTMLButtonElement;
    }

    async function CopyTextToClipBoard() {
      await navigator.clipboard.writeText(text as string);
    }

    function disableButton(button: HTMLButtonElement) {
      button.disabled = true;
    }

    function showTooltip() {
      toolTipRef.current?.show();
    }

    function enableButtonAndHideTooltipAfter3Secs(button: HTMLButtonElement) {
      setTimeout(() => {
        button.disabled = false;
        toolTipRef.current?.hide();
      }, 3000);
    }
  }
}

interface ToolTipInterface {
  show: () => void;
  hide: () => void;
  dispose: () => void;
}
