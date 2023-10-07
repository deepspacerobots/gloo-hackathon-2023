import { useDBContext } from '@/contexts/db.context';
import './SampleComponent.scss';
interface Props {
	title: string;
	subtitle: string;
}
const SampleComponent = (props: Props) => {
	const { title, subtitle } = props;
	const db = useDBContext();
	console.log(db);
	return (
		<div className="sample-component">
			<h1>{title}</h1>
			<p>{subtitle}</p>
		</div>
	);
};
export default SampleComponent;
