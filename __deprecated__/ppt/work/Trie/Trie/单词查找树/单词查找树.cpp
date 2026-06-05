#include<bits/stdc++.h>
using namespace std;

int read(){
	int s=0,f=1;char t=getchar();
	while('0'>t||t>'9'){
		if(t=='-')f=-1;
		t=getchar();
	}
	while('0'<=t&&t<='9'){
		s=(s<<1)+(s<<3)+t-'0';
		t=getchar();
	}
	return s*f;
}

const int N=1000005;
char s[N];

struct Node{
	int ch[26];
}t[N];
int tot=1;

void insert(int l){
	int u=1;
	for(int i=1,dir;i<=l;i++){
		dir=s[i]-'a';
		if(!t[u].ch[dir])
			t[u].ch[dir]=++tot;
		u=t[u].ch[dir];
	}
}

int main(){
	while(scanf("%s",s+1)!=EOF)
		insert(strlen(s+1));
	cout<<tot<<'\n';
	return 0;
}

