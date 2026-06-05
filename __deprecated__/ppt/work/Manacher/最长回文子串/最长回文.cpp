#include<iostream>
#include<cstdio>
#include<cstring>
using namespace std;

const int N=30000005; 
int p[N];

void Manacher(const string& s){
	int Max=0,pos=0;
	for(int i=1;i<s.length();i++){
		if(Max>i)p[i]=min(p[pos*2-i],Max-i);
		else p[i]=1;
		while(s[i+p[i]]==s[i-p[i]])p[i]++;
		if(Max<i+p[i]){
			Max=i+p[i];
			pos=i;
		}
	}
}

int main(){
	string tmp;
	while(cin>>tmp){
		string s;
		memset(p,0,sizeof(p));
		s+='{';
		for(int i=0;i<tmp.length();i++){
			s+='#';
			s+=tmp[i];
		}
		s+='#';
		s+='}';
		
		Manacher(s);
		
		int ans=0;
		for(int i=1;i<s.length();i++)
			ans=max(ans,p[i]-1);
		cout<<ans<<endl;
	}
	return 0;
}
