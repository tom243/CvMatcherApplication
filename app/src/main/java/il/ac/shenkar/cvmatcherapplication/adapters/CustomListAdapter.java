package il.ac.shenkar.cvmatcherapplication.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.List;

import il.ac.shenkar.cvmatcherapplication.R;

//custom adapter for the category pies
public class CustomListAdapter extends ArrayAdapter<String> {

	public CustomListAdapter(Context context, List<String> categories) {
		super(context, R.layout.custom_list_item, categories);
	}

	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
		LayoutInflater inflater = LayoutInflater.from(getContext());
		View currentCustomView = inflater.inflate(R.layout.custom_list_item, parent, false);

		TextView currentTextView = (TextView) currentCustomView.findViewById(R.id.custom_text_view_item);

		String currentCategory = getItem(position);
		currentTextView.setText(currentCategory.toString());
		return currentCustomView;
	}
}