import { cn } from '../utils'

type Props = {
  className?: string
}

export const Logo = ({ className }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 1200"
      fill="none"
      className={cn('w-full h-full', className)}
    >
      <title>77</title>
      <rect width="100%" height="100%" fill="#181818" rx="10%" />
      <path
        fill="#fff"
        d="M286.19 694.143c-4.364 0-8.001-1.455-10.91-4.364-2.909-3.394-4.364-7.274-4.364-11.638 0-1.939.485-4.121 1.455-6.546l168.017-376.766H222.184c-4.849 0-9.213-1.697-13.093-5.091-3.394-3.879-5.091-8.486-5.091-13.82v-72.734c0-5.334 1.697-9.698 5.091-13.093 3.88-3.394 8.244-5.091 13.093-5.091h340.398c5.819 0 10.425 1.697 13.82 5.091 3.394 3.395 5.091 7.759 5.091 13.093v64.734c0 7.273-.727 13.334-2.182 18.183s-3.394 9.698-5.819 14.547L405.475 676.687c-1.455 2.909-4.122 6.546-8.001 10.91-3.879 4.364-9.698 6.546-17.456 6.546H286.19ZM700.068 1014.96c-4.364 0-8.001-1.46-10.91-4.36-2.91-3.4-4.365-7.28-4.365-11.642 0-1.94.485-4.122 1.455-6.547l168.017-376.765H636.061c-4.849 0-9.213-1.697-13.092-5.092-3.394-3.879-5.091-8.485-5.091-13.819V524c0-5.334 1.697-9.698 5.091-13.092 3.879-3.395 8.243-5.092 13.092-5.092H976.46c5.818 0 10.425 1.697 13.819 5.092 3.394 3.394 5.092 7.758 5.092 13.092v64.734c0 7.273-.728 13.335-2.182 18.184-1.455 4.849-3.395 9.698-5.819 14.547L819.353 997.503c-1.455 2.907-4.122 6.547-8.001 10.907-3.879 4.37-9.698 6.55-17.457 6.55h-93.827Z"
      />
    </svg>
  )
}