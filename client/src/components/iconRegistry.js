// Simple icon registry mapping string identifiers to actual React icon components
import { FiShoppingBag } from 'react-icons/fi';
import { AiOutlineMenu } from 'react-icons/ai';
import { RiNotification3Line } from 'react-icons/ri';
import { BsBoxArrowRight, BsFillArrowRightSquareFill } from 'react-icons/bs';
import { BsCurrencyDollar } from 'react-icons/bs';

const registry = {
  FiShoppingBag: FiShoppingBag,
  AiOutlineMenu: AiOutlineMenu,
  RiNotification3Line: RiNotification3Line,
  BsBoxArrowRight: BsBoxArrowRight,
  BsFillArrowRightSquareFill: BsFillArrowRightSquareFill,
  BsCurrencyDollar: BsCurrencyDollar,
};

export function resolveIcon(name) {
  const Icon = registry[name];
  return Icon ? <Icon /> : null;
}

export default registry;
