import * as Tooltip from "@radix-ui/react-tooltip";
import FAIcon from "../components/Icons";

const TooltipWrapper = ({ icon, children, tooltipText, side = 'top', className }) => {
  return (
    <Tooltip.Root delayDuration={0}>
      <Tooltip.Trigger asChild>
		<span>
			{icon && <FAIcon icon={icon} className={className} />}
			{children}
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content             
      side={side}
      className="bg-black text-white text-xs rounded px-2 py-1 shadow-md">
        {tooltipText}
        <Tooltip.Arrow className="fill-black" />
      </Tooltip.Content>
    </Tooltip.Root>
  );
};
export const TooltipProvider = Tooltip.Provider;


export default TooltipWrapper;
